/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from "@wordpress/i18n";

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps, InspectorControls } from "@wordpress/block-editor";

import {
	RangeControl,
	CheckboxControl,
	SelectControl,
} from "@wordpress/components";
/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import "./editor.scss";

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {WPElement} Element to render.
 */
const NEWEST_TO_OLDEST = __("newest-oldest", "parfait-designs-related-posts");
const OLDEST_TO_NEWEST = __("oldest-newest", "parfait-designs-related-posts");
const A_TO_Z = __("a-z", "parfait-designs-related-posts");
const Z_TO_A = __("z-a", "parfait-designs-related-posts");

// these values must not change as it will be inserted in wordpress query argument
const ORDERBY_DATE = "date";
const ORDERBY_TITLE = "title";
const ORDER_ASC = "asc";
const ORDER_DESC = "desc";

// select control options
const options = [
	{
		label: __("Newest to Oldest", "parfait-designs-related-posts"),
		value: NEWEST_TO_OLDEST,
	},
	{
		label: __("Oldest to Newest", "parfait-designs-related-posts"),
		value: OLDEST_TO_NEWEST,
	},
	{
		label: __("A → Z", "parfait-designs-related-posts"),
		value: A_TO_Z,
	},
	{
		label: __("Z → A", "parfait-designs-related-posts"),
		value: Z_TO_A,
	},
];

function getOptionValue(order, orderby) {
	switch (true) {
		case order === ORDER_DESC && orderby === ORDERBY_DATE:
			return NEWEST_TO_OLDEST;
		case order === ORDER_ASC && orderby === ORDERBY_DATE:
			return OLDEST_TO_NEWEST;
		case order === ORDER_ASC && orderby === ORDERBY_TITLE:
			return A_TO_Z;
		case order === ORDER_DESC && orderby === ORDERBY_TITLE:
			return Z_TO_A;
		default:
			break;
	}
}

function handleSelectChange(value) {
	switch (value) {
		case NEWEST_TO_OLDEST:
			return { order: ORDER_DESC, orderby: ORDERBY_DATE };
		case OLDEST_TO_NEWEST:
			return { order: ORDER_ASC, orderby: ORDERBY_DATE };
		case A_TO_Z:
			return { order: ORDER_ASC, orderby: ORDERBY_TITLE };
		case Z_TO_A:
			return { order: ORDER_DESC, orderby: ORDERBY_TITLE };
		default:
			break;
	}
}

export default function Edit({ attributes, setAttributes }) {
	return (
		<>
			<InspectorControls key="pd-related-posts-setting">
				<fieldset className="pd-related-posts-setting">
					<h2 className="pd-related-posts-setting-heading">
						{__("Query", "parfait-designs-related-posts")}
					</h2>
					<RangeControl
						label={__("Number of Posts", "parfait-designs-related-posts")}
						value={attributes.postsPerPage}
						onChange={(value) =>
							setAttributes({
								...attributes,
								postsPerPage: parseInt(value),
							})
						}
						min={1}
						max={6}
					/>
					<CheckboxControl
						label={__(
							"Include categories in query",
							"parfait-designs-related-posts"
						)}
						checked={attributes.includeCategory}
						onChange={(value) =>
							setAttributes({ ...attributes, includeCategory: value })
						}
						help={__(
							"Find posts that share same category as current post.",
							"parfait-designs-related-posts"
						)}
					/>
					<CheckboxControl
						label={__("Include tags in query", "parfait-designs-related-posts")}
						checked={attributes.includeTags}
						onChange={(value) =>
							setAttributes({ ...attributes, includeTags: value })
						}
						help={__(
							"Find posts that share same tags as current post.",
							"parfait-designs-related-posts"
						)}
					/>
					<SelectControl
						label={__("Order by", "parfait-designs-related-posts")}
						value={getOptionValue(attributes.order, attributes.orderby)}
						options={options}
						onChange={(value) => {
							const updateValue = handleSelectChange(value);
							setAttributes({
								...attributes,
								...updateValue,
							});
						}}
					/>
				</fieldset>
			</InspectorControls>
			<section
				{...useBlockProps({
					className: "pd-editor-related-posts-wrapper",
				})}
			>
				<h2 className="pd-editor-related-post-heading">
					{__("Related Posts", "parfait-designs-related-posts")}
				</h2>
				<ul className="pd-editor-related-posts">
					{[...new Array(attributes.postsPerPage)].map((_, i) => (
						<li className="pd-editor-related-posts__item">
							<article className="pd-editor-related-post">
								<div
									className="pd-editor-related-post__thumbnail"
									aria-hidden="true"
								></div>
								<h3 className="pd-editor-related-post__title">
									{__("Post Title", "parfait-designs-related-posts")}
								</h3>
							</article>
						</li>
					))}
				</ul>
			</section>
		</>
	);
}
