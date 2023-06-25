<?php

/**
 * @see https://github.com/WordPress/gutenberg/blob/trunk/docs/reference-guides/block-api/block-metadata.md#render
 */
$categories = get_the_category();
$tags = get_the_tags();

$category_terms = array();
$tags_terms = array();


foreach ($tags as $tag) {
	array_push($tags_terms, $tag->term_id);
}

foreach ($categories as $category) {
	array_push($category_terms, $category->term_id);
}

$args = array(
	'post_type' => 'post',
	'orderby' => 'date',
	'order' => 'desc',
	'posts_per_page' => 3,
	'post__not_in' => array(get_the_ID()),
	'tax_query' => array(
		'relation' => 'OR',
		array(
			'taxonomy' => 'post_tag',
			'field' => 'id',
			'terms' => $tags_terms,
		),
		array(
			'taxonomy' => 'category',
			'field' => 'id',
			'terms' => $category_terms
		)
	)
);

$query = new WP_Query($args);

if ($query->have_posts()) :
	while ($query->have_posts()) :
		$query->the_post();
?>
		<div>
			<?php echo get_the_post_thumbnail(null, 'medium', array('class' => 'pd-related-post__thumbnail')) ?>
			<p><?php echo the_title() ?></p>
		</div>
	<?php endwhile ?>
<?php endif ?>

<p <?php echo get_block_wrapper_attributes(); ?>>
	<?php esc_html_e('Parfait Designs Related Posts – hello from a dynamic block!', 'parfait-designs-related-posts'); ?>
</p>