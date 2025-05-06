<?php

/**
 * Twenty Twenty-Four functions and definitions
 *
 * @link https://developer.wordpress.org/themes/basics/theme-functions/
 *
 * @package Twenty Twenty-Four
 * @since Twenty Twenty-Four 1.0
 */

/**
 * Register block styles.
 */

if (! function_exists('twentytwentyfour_block_styles')) :
	/**
	 * Register custom block styles
	 *
	 * @since Twenty Twenty-Four 1.0
	 * @return void
	 */
	function twentytwentyfour_block_styles()
	{

		register_block_style(
			'core/details',
			array(
				'name'         => 'arrow-icon-details',
				'label'        => __('Arrow icon', 'twentytwentyfour'),
				/*
				 * Styles for the custom Arrow icon style of the Details block
				 */
				'inline_style' => '
				.is-style-arrow-icon-details {
					padding-top: var(--wp--preset--spacing--10);
					padding-bottom: var(--wp--preset--spacing--10);
				}

				.is-style-arrow-icon-details summary {
					list-style-type: "\2193\00a0\00a0\00a0";
				}

				.is-style-arrow-icon-details[open]>summary {
					list-style-type: "\2192\00a0\00a0\00a0";
				}',
			)
		);
		register_block_style(
			'core/post-terms',
			array(
				'name'         => 'pill',
				'label'        => __('Pill', 'twentytwentyfour'),
				/*
				 * Styles variation for post terms
				 * https://github.com/WordPress/gutenberg/issues/24956
				 */
				'inline_style' => '
				.is-style-pill a,
				.is-style-pill span:not([class], [data-rich-text-placeholder]) {
					display: inline-block;
					background-color: var(--wp--preset--color--base-2);
					padding: 0.375rem 0.875rem;
					border-radius: var(--wp--preset--spacing--20);
				}

				.is-style-pill a:hover {
					background-color: var(--wp--preset--color--contrast-3);
				}',
			)
		);
		register_block_style(
			'core/list',
			array(
				'name'         => 'checkmark-list',
				'label'        => __('Checkmark', 'twentytwentyfour'),
				/*
				 * Styles for the custom checkmark list block style
				 * https://github.com/WordPress/gutenberg/issues/51480
				 */
				'inline_style' => '
				ul.is-style-checkmark-list {
					list-style-type: "\2713";
				}

				ul.is-style-checkmark-list li {
					padding-inline-start: 1ch;
				}',
			)
		);
		register_block_style(
			'core/navigation-link',
			array(
				'name'         => 'arrow-link',
				'label'        => __('With arrow', 'twentytwentyfour'),
				/*
				 * Styles for the custom arrow nav link block style
				 */
				'inline_style' => '
				.is-style-arrow-link .wp-block-navigation-item__label:after {
					content: "\2197";
					padding-inline-start: 0.25rem;
					vertical-align: middle;
					text-decoration: none;
					display: inline-block;
				}',
			)
		);
		register_block_style(
			'core/heading',
			array(
				'name'         => 'asterisk',
				'label'        => __('With asterisk', 'twentytwentyfour'),
				'inline_style' => "
				.is-style-asterisk:before {
					content: '';
					width: 1.5rem;
					height: 3rem;
					background: var(--wp--preset--color--contrast-2, currentColor);
					clip-path: path('M11.93.684v8.039l5.633-5.633 1.216 1.23-5.66 5.66h8.04v1.737H13.2l5.701 5.701-1.23 1.23-5.742-5.742V21h-1.737v-8.094l-5.77 5.77-1.23-1.217 5.743-5.742H.842V9.98h8.162l-5.701-5.7 1.23-1.231 5.66 5.66V.684h1.737Z');
					display: block;
				}

				/* Hide the asterisk if the heading has no content, to avoid using empty headings to display the asterisk only, which is an A11Y issue */
				.is-style-asterisk:empty:before {
					content: none;
				}

				.is-style-asterisk:-moz-only-whitespace:before {
					content: none;
				}

				.is-style-asterisk.has-text-align-center:before {
					margin: 0 auto;
				}

				.is-style-asterisk.has-text-align-right:before {
					margin-left: auto;
				}

				.rtl .is-style-asterisk.has-text-align-left:before {
					margin-right: auto;
				}",
			)
		);
	}
endif;

add_action('init', 'twentytwentyfour_block_styles');

/**
 * Enqueue block stylesheets.
 */

if (! function_exists('twentytwentyfour_block_stylesheets')) :
	/**
	 * Enqueue custom block stylesheets
	 *
	 * @since Twenty Twenty-Four 1.0
	 * @return void
	 */
	function twentytwentyfour_block_stylesheets()
	{
		/**
		 * The wp_enqueue_block_style() function allows us to enqueue a stylesheet
		 * for a specific block. These will only get loaded when the block is rendered
		 * (both in the editor and on the front end), improving performance
		 * and reducing the amount of data requested by visitors.
		 *
		 * See https://make.wordpress.org/core/2021/12/15/using-multiple-stylesheets-per-block/ for more info.
		 */
		wp_enqueue_block_style(
			'core/button',
			array(
				'handle' => 'twentytwentyfour-button-style-outline',
				'src'    => get_parent_theme_file_uri('assets/css/button-outline.css'),
				'ver'    => wp_get_theme(get_template())->get('Version'),
				'path'   => get_parent_theme_file_path('assets/css/button-outline.css'),
			)
		);
	}
endif;

add_action('init', 'twentytwentyfour_block_stylesheets');

/**
 * Register pattern categories.
 */

if (! function_exists('twentytwentyfour_pattern_categories')) :
	/**
	 * Register pattern categories
	 *
	 * @since Twenty Twenty-Four 1.0
	 * @return void
	 */
	function twentytwentyfour_pattern_categories()
	{

		register_block_pattern_category(
			'twentytwentyfour_page',
			array(
				'label'       => _x('Pages', 'Block pattern category', 'twentytwentyfour'),
				'description' => __('A collection of full page layouts.', 'twentytwentyfour'),
			)
		);
	}
endif;

add_action('init', 'twentytwentyfour_pattern_categories');

// Starts Here

function remove_admin_menus()
{
	remove_menu_page('edit.php'); // Posts
	remove_menu_page('dashboard.php'); // Posts
	remove_menu_page('upload.php'); // Media
	remove_menu_page('edit.php?post_type=page'); // Pages
	remove_menu_page('themes.php'); // Appearance
	remove_menu_page('plugins.php'); // Plugins
	remove_menu_page('edit-comments.php'); // Comments
}
add_action('admin_menu', 'remove_admin_menus');

function force_favicon()
{
	echo '<link rel="icon" href="' . get_template_directory_uri() . '/assets/images/favicon.ico" type="image/x-icon">';
}
add_action('wp_head', 'force_favicon');
add_action('admin_head', 'force_favicon');

function customize_admin_bar()
{
	global $wp_admin_bar;

	// Remove WordPress logo menu
	$wp_admin_bar->remove_node('wp-logo');

	// Remove Updates menu
	$wp_admin_bar->remove_node('updates');

	// Remove + New menu
	$wp_admin_bar->remove_node('new-content');

	// Remove Comments menu
	$wp_admin_bar->remove_node('comments');
}
add_action('wp_before_admin_bar_render', 'customize_admin_bar');

function remove_wp_admin_bar_items()
{
	global $wp_admin_bar;
	$wp_admin_bar->remove_node('wp-logo'); // Removes WordPress logo & menu
}
add_action('wp_before_admin_bar_render', 'remove_wp_admin_bar_items');

function custom_dashboard_widget()
{
	$current_user = wp_get_current_user();
	echo "<h2>管理パネルへようこそ！</h2>";
}
function add_custom_dashboard_widget()
{
	wp_add_dashboard_widget('custom_dashboard_widget', '管理者メッセージ ', 'custom_dashboard_widget');
}

function change_dashboard_heading($translated_text, $text, $domain)
{
	if ($text === 'Dashboard' && $domain === 'default') {
		return 'ダッシュボード';
	}
	return $translated_text;
}
add_filter('gettext', 'change_dashboard_heading', 10, 3);
add_action('wp_dashboard_setup', 'add_custom_dashboard_widget');

function change_dashboard_menu_label()
{
	global $menu;

	foreach ($menu as $key => $value) {
		if ($value[2] === 'index.php') {
			$menu[$key][0] = 'ダッシュボード'; // Change label here
			break;
		}
	}
}
add_action('admin_menu', 'change_dashboard_menu_label');

function remove_dashboard_widgets()
{
	remove_meta_box('dashboard_quick_press', 'dashboard', 'side'); // Quick Draft
	remove_meta_box('dashboard_primary', 'dashboard', 'side'); // WordPress News
	remove_meta_box('dashboard_activity', 'dashboard', 'normal'); // Activity
	remove_meta_box('dashboard_right_now', 'dashboard', 'normal'); // At a Glance
	remove_meta_box('dashboard_site_health', 'dashboard', 'normal'); // Remove Site Health Status
}
add_action('wp_dashboard_setup', 'remove_dashboard_widgets');

function remove_site_health_widget()
{
	remove_meta_box('dashboard_site_health', 'dashboard', 'normal'); // Remove Site Health Status
}
add_action('wp_dashboard_setup', 'remove_site_health_widget');

function remove_dashboard_menus()
{
	remove_submenu_page('index.php', 'update-core.php'); // Remove "Updates"
	remove_submenu_page('index.php', 'index.php'); // Remove "Home"
}
add_action('admin_menu', 'remove_dashboard_menus');

function hide_dashboard_move_buttons()
{
	echo "
    <style>
        .handle-order-higher,
        .handle-order-lower {
            display: none !important; /* Hide Move Up and Move Down buttons */
        }
    </style>";
}
add_action('admin_head', 'hide_dashboard_move_buttons');

function allow_iframes_in_admin()
{
	echo '<style> iframe { display: block; width: 100%; height: 90vh; border: none; } </style>';
}
add_action('admin_head', 'allow_iframes_in_admin');

function custom_phpmyadmin_page_content()
{
	$phpmyadmin_url = 'http://127.0.0.1/phpmyadmin/index.php?route=/sql&pos=0&db=atsumedia&table=article_data';
	// $phpmyadmin_url = 'www.google.com';

	// $phpmyadmin_url = 'http://localhost/phpmyadmin/index.php?route=/sql&pos=0&db=atsumedia&table=article_data';
	echo '<div style="height: 90vh; overflow: hidden;">';
	echo '<iframe src="' . esc_url($phpmyadmin_url) . '" width="100%" height="100%" style="border: none;"></iframe>';
	echo '</div>';
}

function display_custom_table()
{
	global $wpdb;

	// Replace 'your_table_name' with your actual MySQL table name
	$table_name = $wpdb->prefix . 'article_data';
	$results = $wpdb->get_results("SELECT * FROM $table_name");

	if (empty($results)) {
		return "<p>No data found.</p>";
	}

	// Generate HTML table
	$output = '<table border="1" cellpadding="5" cellspacing="0">';
	$output .= '<tr><th>ID</th><th>Name</th><th>Email</th></tr>';

	foreach ($results as $row) {
		$output .= "<tr><td>{$row->id}</td><td>{$row->name}</td><td>{$row->email}</td></tr>";
	}

	$output .= '</table>';
	return $output;
}

// Register as a shortcode
add_shortcode('custom_table_v1', 'display_custom_table');

function custom_csv_menu()
{
	add_menu_page(
		'Upload CSV', // Page title
		'CSV のアップロード', // Menu title
		'manage_options', // Capability
		'custom-csv-uploader', // Menu slug
		'custom_csv_upload_page', // Callback function
		'dashicons-upload', // Icon
		20 // Position
	);
}
add_action('admin_menu', 'custom_csv_menu');
function enqueue_datatables_scripts()
{
	wp_enqueue_script('jquery');
	wp_enqueue_script('datatables-js', 'https://cdn.datatables.net/1.13.6/js/jquery.dataTables.min.js', ['jquery'], null, true);
	wp_enqueue_style('datatables-css', 'https://cdn.datatables.net/1.13.6/css/jquery.dataTables.min.css');
	wp_enqueue_script('custom-datatable-handler', get_template_directory_uri() . '/custom_function/js/datatable-handler.js', ['jquery', 'datatable-js'], null, true);
}
add_action('wp_enqueue_scripts', 'enqueue_datatables_scripts');

function enqueue_datatables_assets()
{
	// DataTables CSS
	wp_enqueue_style('datatables-css', 'https://cdn.datatables.net/1.11.5/css/jquery.dataTables.min.css');
	
	// jQuery (WordPress already includes it, but we ensure it's available)
	wp_enqueue_script('jquery');

	// DataTables JS
	wp_enqueue_script('datatables-js', 'https://cdn.datatables.net/1.11.5/js/jquery.dataTables.min.js', array('jquery'), null, true);
}
add_action('admin_enqueue_scripts', 'enqueue_datatables_assets'); // Load only in admin pages

function load_flatpickr_globally()
{
	wp_enqueue_style(
		'flatpickr-css',
		'https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css',
		array(),
		null
	);

	wp_enqueue_script(
		'flatpickr-js',
		'https://cdn.jsdelivr.net/npm/flatpickr',
		array('jquery'),
		null,
		true
	);
}
add_action('wp_enqueue_scripts', 'load_flatpickr_globally');


if (is_admin()) { // Only loads in the admin panel
	require_once get_template_directory() . '/custom_function/csv_upload.php';
}

// Enqueue CSS for styling
function custom_csv_enqueue_styles()
{
	wp_enqueue_style('custom-csv-style', get_template_directory_uri() . '/css/style_csv.css');
}
add_action('admin_enqueue_scripts', 'custom_csv_enqueue_styles');

// Include the CSV processing function
require_once get_template_directory() . '/custom_function/csv_upload.php';

// Handle file upload and immediate processing
if (isset($_POST['upload_csv']) && check_admin_referer('custom_csv_upload', 'custom_csv_nonce')) {
	if (!empty($_FILES['csv_file']['tmp_name']) && !empty($_POST['file_type'])) {
		$upload_dir = wp_upload_dir();
		$target_file = $upload_dir['path'] . '/' . basename($_FILES['csv_file']['name']);
		$file_type = sanitize_text_field($_POST['file_type']); // Sanitize input

		if (move_uploaded_file($_FILES['csv_file']['tmp_name'], $target_file)) {
			update_option('uploaded_csv_path', $target_file);
			custom_process_csv_function($target_file, $file_type);
		} else {
			echo '<div class="error"><p>Failed to upload CSV.</p></div>';
		}
	} else {
		echo '<div class="error"><p>Invalid file or missing file type.</p></div>';
	}
}

add_action('wp_ajax_fetch_csv_data', function () {
	$file_path = get_option('uploaded_csv_path');
	$file_type = isset($_POST['file_type']) ? sanitize_text_field($_POST['file_type']) : '';

	if ($file_path) {
		// $result = custom_process_csv_function($file_path, $file_type);
		// wp_send_json($result);
	} else {
		wp_send_json(['error' => 'No CSV uploaded yet.']);
	}
});

function redirect_to_login_if_not_admin()
{
	if (!is_admin() && !is_user_logged_in()) {
		wp_redirect(wp_login_url());
		exit;
	} elseif (!is_admin() && current_user_can('administrator')) {
		wp_redirect(admin_url());
		exit;
	}
}
add_action('template_redirect', 'redirect_to_login_if_not_admin');

require_once get_template_directory() . '/custom_function/news/content_news.php';

if (!defined('ABSPATH')) {
	exit;
}

// Add menu item in admin panel
function custom_content_menu()
{
	add_menu_page(
		'新しいニュース',
		'新しいニュース',
		'edit_posts',
		'custom-content-form',
		'custom_content_page',
		'dashicons-welcome-write-blog',
		20
	);
}
add_action('admin_menu', 'custom_content_menu');
add_action('wp_ajax_insert_at_news', 'insert_at_news');

// Enqueue necessary scripts for media uploader
function custom_content_admin_scripts($hook)
{
	if ($hook !== 'toplevel_page_custom-content-form') {
		return;
	}
	wp_enqueue_media(); // WordPress built-in media uploader
}
add_action('admin_enqueue_scripts', 'custom_content_admin_scripts');

// Admin page content
add_action('admin_footer', 'custom_content_scripts');

function enqueue_editorjs_assets() {
    // Enqueue Editor.js and its core tools
    wp_enqueue_script('editorjs', 'https://cdn.jsdelivr.net/npm/@editorjs/editorjs@latest', array(), null, true);
    wp_enqueue_script('editorjs-header', 'https://cdn.jsdelivr.net/npm/@editorjs/header@latest', array('editorjs'), null, true);
    wp_enqueue_script('editorjs-list', 'https://cdn.jsdelivr.net/npm/@editorjs/list@latest', array('editorjs'), null, true);
    wp_enqueue_script('editorjs-embed', 'https://cdn.jsdelivr.net/npm/@editorjs/embed', array('editorjs'), null, true);
    wp_enqueue_script('editorjs-paragraph', 'https://cdn.jsdelivr.net/npm/@editorjs/paragraph@latest', array('editorjs'), null, true);
    wp_enqueue_script('editorjs-image', 'https://cdn.jsdelivr.net/npm/@editorjs/image@latest', array('editorjs'), null, true);
    wp_enqueue_script('editorjs-quote', 'https://cdn.jsdelivr.net/npm/@editorjs/quote@latest', array('editorjs'), null, true);
    wp_enqueue_script('editorjs-table', 'https://cdn.jsdelivr.net/npm/@editorjs/table@latest', array('editorjs'), null, true);
    wp_enqueue_script('editorjs-linktool', 'https://cdn.jsdelivr.net/npm/@editorjs/link@latest', array('editorjs'), null, true);

    // Load the Alignment Plugin (Make sure it comes after Editor.js)
	wp_enqueue_script(
        'editorjs-text-alignment-blocktune', get_template_directory_uri() . '/lib/bundle.js',array('editorjs'), null, true
    );
    wp_enqueue_script('editorjs-text-alignment-blocktune', 'https://cdn.jsdelivr.net/npm/@editorjs/text-alignment-blocktune@latest/dist/bundle.js', array('editorjs'), null, true);
	wp_enqueue_script(
        'editorjs-header-with-alignment',
        'https://cdn.jsdelivr.net/npm/editorjs-header-with-alignment@1.0.1/dist/bundle.js',
        array('editorjs'),
        null,
        true
    );
}
add_action('admin_enqueue_scripts', 'enqueue_editorjs_assets');

function fetch_url_metadata()
{
	if (!isset($_POST['url'])) {
		wp_send_json_error(['message' => 'URL is required']);
	}

	$url = esc_url_raw($_POST['url']);

	// Use an external API to get metadata (e.g., jsonlink.io)
	$response = wp_remote_get("https://jsonlink.io/api/extract?url=" . urlencode($url));

	if (is_wp_error($response)) {
		wp_send_json_error(['message' => 'Failed to fetch data']);
	}

	$body = wp_remote_retrieve_body($response);
	$data = json_decode($body, true);

	if (!$data) {
		wp_send_json_error(['message' => 'Invalid response']);
	}

	// Format the response for Editor.js
	$result = [
		'success' => 1,
		'meta' => [
			'title' => $data['title'] ?? '',
			'description' => $data['description'] ?? '',
			'image' => ['url' => $data['images'][0] ?? ''],
		]
	];

	wp_send_json($result);
}

function custom_page_setting_menu()
{
	add_menu_page(
		'Page Settings', // Page title
		'ページ設定', // Menu title
		'manage_options', // Capability
		'page-settings-config', // Menu slug
		'page_settings_config', // Callback function
		'dashicons-admin-generic', // Icon
		25 // Position
	);
}
add_action('admin_menu', 'custom_page_setting_menu');
require_once get_template_directory() . '/custom_function/custom_page_setting.php';

function custom_vod_menu()
{
	add_menu_page(
		'Vod Menu', // Page title
		'VODの順序変更', // Menu title
		'manage_options', // Capability
		'call-vod-order', // Menu slug
		'call_vod_order', // Callback function
		'dashicons-format-video', // Icon
		26 // Position
	);
}
add_action('admin_menu', 'custom_vod_menu');
require_once get_template_directory() . '/custom_function/custom_vod.php';

function custom_cast_menu()
{
	add_menu_page(
		'Cast Menu', // Page title
		'キャスト順の変更', // Menu title
		'manage_options', // Capability
		'call-cast-order', // Menu slug
		'call_cast_order', // Callback function
		'dashicons-groups', // Icon
		27 // Position
	);
}
add_action('admin_menu', 'custom_cast_menu');
require_once get_template_directory() . '/custom_function/custom_cast.php';

function custom_switch_images_menu()
{
	add_menu_page(
		'Switch Images Menu', // Page title
		'画像を差し替える', // Menu title
		'manage_options', // Capability
		'switch-image', // Menu slug
		'switch_image', // Callback function
		'dashicons-format-image', // Icon
		27 // Position
	);
}
add_action('admin_menu', 'custom_switch_images_menu');
require_once get_template_directory() . '/custom_function/switch_image.php';

function custom_free_text_menu()
{
	add_menu_page(
		'Free Texts Menu', // Page title
		'フリーテキスト設定', // Menu title
		'manage_options', // Capability
		'free-text-menu', // Menu slug
		'free_text_menu', // Callback function
		'dashicons-welcome-write-blog', // Icon
		28 // Position
	);
}
add_action('admin_menu', 'custom_free_text_menu');
require_once get_template_directory() . '/custom_function/free_text_menu.php';

function master_view_data_menu()
{
	add_menu_page(
		'Free Texts Menu', // Page title
		'マスターデータを表示', // Menu title
		'manage_options', // Capability
		'master-data-view', // Menu slug
		'master_data_view', // Callback function
		'dashicons-welcome-write-blog', // Icon
		29 // Position
	);
}
add_action('admin_menu', 'master_view_data_menu');
require_once get_template_directory() . '/custom_function/master_data_view.php';

function article_data_menu()
{
	add_menu_page(
		'Free Texts Menu', // Page title
		'マスターデータを表示', // Menu title
		'manage_options', // Capability
		'master-data-view', // Menu slug
		'article_data_view', // Callback function
		'dashicons-welcome-write-blog', // Icon
		30 // Position
	);
}
add_action('admin_menu', 'article_data_menu');
require_once get_template_directory() . '/custom_function/article_data_view.php';

function hide_admin_menus_for_all_users()
{
	remove_menu_page('edit.php');                     // Posts
	remove_menu_page('upload.php');                   // Media
	remove_menu_page('edit.php?post_type=page');      // Pages
	remove_menu_page('edit-comments.php');            // Comments
	remove_menu_page('plugins.php');                  // Plugins
	remove_menu_page('tools.php');                    // Tools
}
add_action('admin_menu', 'hide_admin_menus_for_all_users', 999);

function remove_admin_toolbar_items_for_all_users($wp_admin_bar)
{
	$wp_admin_bar->remove_node('new-post');
	$wp_admin_bar->remove_node('comments');
	$wp_admin_bar->remove_node('updates');
}
add_action('admin_bar_menu', 'remove_admin_toolbar_items_for_all_users', 999);

function add_custom_favicon()
{
	echo '<link rel="icon" href="' . get_template_directory_uri() . '/assets/images/favicon.ico" type="image/x-icon">';
}
add_action('wp_head', 'add_custom_favicon');

// Register WordPress API Endpoint
add_action('wp_ajax_fetch_url_metadata', 'fetch_url_metadata');
add_action('wp_ajax_nopriv_fetch_url_metadata', 'fetch_url_metadata');
