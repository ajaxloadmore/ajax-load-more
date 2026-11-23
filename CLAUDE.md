# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Ajax Load More (ALM) is the free core WordPress plugin for infinite scroll / "load more" of posts. Premium add-ons (Filters, Cache, Paging, SEO, Preloaded, Templates, Pro bundle, etc.) are **separate plugins** living alongside this one in `wp-content/plugins/ajax-load-more-*`. Core detects them through `has_action( 'alm_<addon>_installed' )` and calls their hooks or `window.alm*` JS callbacks. When changing a contract between core and an add-on, check the sibling plugin too.

## Commands

```bash
npm install            # postinstall also runs `composer install` (PHPCS, WP-CLI)
npm run dev            # wp-scripts start (watch), outputs to build/
npm run build          # generate lang/ajax-load-more.pot, then production webpack build
npm run lint           # all linters in parallel (css, js, md, package.json, php)
npm run lint:js        # ESLint (@wordpress/eslint-plugin + prettier)
npm run lint:php       # composer run lint → phpcs --standard=phpcs.xml
npm run format         # wp-scripts format + phpcbf
```

There is no automated test suite. Check changes by running the plugin in a local WordPress install.

`build/` is **committed** and shipped. The WordPress.org deploy (`.github/workflows/deploy.yml`, which runs when a GitHub release is published) rebuilds it, but the committed copy should still be rebuilt after `src/` changes.

## Release / versioning

A version bump touches: the `Version:` header, `ALM_VERSION` and `ALM_RELEASE` in `ajax-load-more.php`, and `Stable tag` plus the `== Changelog ==` entry in `README.txt`. `README.txt` is the authoritative changelog; `CHANGELOG.md` and the `package.json` version lag behind. Files excluded from the shipped zip are listed in `.distignore`.

## Architecture

### Request lifecycle

1. **Render (PHP).** `[ajax_load_more]` shortcode, the `alm_render()` function, or the Gutenberg block (`src/blocks/core/render.php`) all go through `ALM_SHORTCODE::alm_render_shortcode()` (`core/classes/class-alm-shortcode.php`). It turns shortcode atts into a container `<div class="ajax-load-more-wrap">` with many `data-*` attributes. Per-instance JS data is collected with `ALM_LOCALIZE` and printed as `window.<localize_id>_vars`.
2. **Init (JS).** `src/frontend/js/ajax-load-more.js` finds each `.ajax-load-more-wrap`, reads the data attributes into an `alm` object (stored on `window.ajax_load_more` or `window.ajax_load_more_{id}`), and lets each add-on/extension module (`addons/*.js`, `extensions/*.js`) add its own params (`*CreateParams`).
3. **Fetch.** By default it sends a GET to `admin-ajax.php` with `action=alm_get_posts` (params built in `functions/queryParams.js`). Several add-ons swap the URL: REST API extension, Next Page, Single Posts, Query Loop/WooCommerce/Elementor (these fetch the next page's HTML instead), and ACF (`action=alm_acf`).
4. **Query (PHP).** `AjaxLoadMore::alm_query_posts()` in `ajax-load-more.php` builds `WP_Query` args via `ALM_QUERY_ARGS::alm_build_queryargs()` (`core/classes/class-alm-queryargs.php`). It applies the `alm_query_args_{id}` and `alm_query_after_{id}` filters, renders each post through `alm_loop()`, and returns JSON `{ html, meta: { postcount, totalposts, debug }, facets? }`. `query_type=totalposts` returns counts only (Paging/Preloaded).
5. **Display (JS).** The returned HTML is inserted as-is (it is *not* sanitized client-side, so escaping must happen in PHP/templates) with a transition, and then public callbacks fire (`almComplete`, `almDone`, `almEmpty`, `almOnLoad`, etc.).

### Repeater templates

`alm_loop()` → `alm_get_current_repeater()` (`core/functions.php`) resolves which PHP template to `include`:
- Theme Repeaters add-on (the `theme_repeater` param).
- `template_*` names → Templates / Custom Repeaters v2 add-on. Template content lives in the DB (`{prefix}alm`, `{prefix}alm_unlimited`) and is written to disk on demand by `alm_create_template()`.
- `default` → a theme override at `{theme}/alm_templates/default.php` (path filterable via `alm_template_path`), falling back to the plugin's repeater dir.

Every resolved path passes through `alm_is_valid_path()`. Repeater names coming from requests are `sanitize_file_name`'d. Keep both protections when touching this code.

### Admin

- `admin/admin.php` holds menus, admin enqueues and admin AJAX actions. Settings fields are in `admin/functions/settings.php`, and page templates are in `admin/views/`.
- The Shortcode Builder is the legacy jQuery/PHP UI in `admin/shortcode-builder/`, not webpack. `src/shortcode-builder/` currently contains only empty scaffold directories.
- The add-on registry (names, license option keys, EDD item IDs, `*_installed` actions) is in `core/functions/addons.php`, and the `ALM_*_ITEM_NAME` constants are in `ajax-load-more.php`. Licensing uses `core/libs/EDD_SL_Plugin_Updater.php`.

### Build entries (`webpack.config.js`)

`frontend/ajax-load-more(.min)`, `admin/index`, `blocks/core/index`, `blocks/filters/index`. The webpack output is a `var` library named `ajaxloadmore`, so the named exports at the bottom of `ajax-load-more.js` (`filter`, `reset`, `getPostCount`, …) become the public `ajaxloadmore.*` JS API. Blocks are registered from `build/blocks/*` in `core/classes/class-alm-blocks.php`. The Filters block is only registered when the Filters add-on is active.

## Conventions

- PHP follows WordPress Coding Standards via `phpcs.xml`, with these project deviations: short array syntax `[]` is **required**, Yoda conditions are not required, and globals must be prefixed `alm` / `ajax_load_more` / `AjaxLoadMore`. The text domain is `ajax-load-more`. PHP compatibility target is 7.4 (Composer platform).
- Public extension points are WordPress filters/actions named `alm_*` and JS callbacks named `window.alm*`. Treat both as public API, since third-party sites and the add-ons depend on them.
- Button labels are sanitized twice: in PHP by `ALM_SHORTCODE::alm_strip_tags()` (allows only `span`, `i`, `b`, `strong`) and in JS by DOMPurify before they are written to `innerHTML`. DOMPurify is used only for these labels.
- `axios`, `qs`, `imagesloaded` and `dompurify` are bundled into `build/frontend/`, so they belong in `dependencies` (not `devDependencies`) so that `npm audit --omit=dev` covers them.
- Values from AJAX requests come in as strings. Cast numeric params to `(int)` before doing arithmetic (fixed for PHP 8 TypeErrors in #263).
