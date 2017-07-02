<?php
/**
 * The main template file
 * This is the most generic template file in a WordPress theme
 * and one of the two required files for a theme (the other being style.css).
 * It is used to display a page when nothing more specific matches a query.
 * E.g., it puts together the home page when no home.php file exists
 *
 * Methods for TimberHelper can be found in the /lib sub-directory
 *
 * @package  WordPress
 * @subpackage  Timber
 * @since   Timber 0.1
 */

$context = Timber::get_context();

$query = array(
    'category_name' => 'evenements,publications',
);

$posts = Timber::get_posts( $query );

$sorted_posts = array();

foreach ( $posts as $post ) {
    // Get first category of post
    $category = $post->category();



    // Filter past events for events cat
    if ($category->slug === 'evenements'):
        $date = get_field('date_start', $post->ID, false);
        $end_date_passed_check = DateTime::createFromFormat('Ymd', $date);
        $date = new DateTime($date);
        $event_expired = $end_date_passed_check->format('Ymd') < date('Ymd');
        if ($event_expired == true):
            continue;
        endif;
    endif;
    // Fill post back to sorted_posts
    $sorted_posts[ $category->slug ][] = $post;
}

// Add sorted posts to context
$context['posts'] = $sorted_posts;

$templates = array( 'front-page.twig' );
Timber::render( $templates, $context );
