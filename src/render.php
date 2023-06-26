<?php

/**
 * @see https://github.com/WordPress/gutenberg/blob/trunk/docs/reference-guides/block-api/block-metadata.md#render
 */

// get terms of current post
$post_categories = get_the_category();
$post_tags = get_the_tags();

// terms for query argument
$category_args = array();
$tags_args = array();

if ($attributes['includeTags'] && !is_null($post_tags)) {
	// store terms for query args
	foreach ($post_tags as $tag) {
		array_push($tags_args, $tag->term_id);
	}
}

if ($attributes['includeCategory'] && !is_null($post_categories)) {
	foreach ($post_categories as $category) {
		array_push($category_args, $category->term_id);
	}
}

$args = array(
	'post_type' => 'post',
	'post_status' => 'publish',
	'orderby' => $attributes['orderby'],
	'order' => $attributes['order'],
	'posts_per_page' => $attributes['postsPerPage'],
	'post__not_in' => array(get_the_ID()),
	'tax_query' => array(
		'relation' => 'OR',
		array(
			'taxonomy' => 'post_tag',
			'field' => 'id',
			'terms' => $tags_args,
		),
		array(
			'taxonomy' => 'category',
			'field' => 'id',
			'terms' => $category_args
		)
	)
);

$query = new WP_Query($args);

if ($query->have_posts()) : ?>
	<section class='pd-related-posts-wrapper'>
		<h2 id='pd-related-posts-heading'>Related Posts</h2>
		<ul class='pd-related-posts' aria-labelledby="pd-related-posts-heading">
			<?php while ($query->have_posts()) :
				$query->the_post();
			?>
				<li class='pd-related-posts__item'>
					<article>
						<?php echo get_the_post_thumbnail(null, 'medium', array('class' => 'pd-related-post__thumbnail')) ?>
						<a href='<?php echo the_permalink() ?>'>
							<h3 class='pd-related-post__title'><?php echo the_title() ?></h3>
						</a>
					</article>
				</li>
			<?php endwhile ?>
		</ul>
	</section>
<?php endif ?>

<?php wp_reset_postdata() ?>