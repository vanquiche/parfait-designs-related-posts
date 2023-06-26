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
const NEWEST_TO_OLDEST = "newest-oldest";
const OLDEST_TO_NEWEST = "oldest-newest";
const A_TO_Z = "a-z";
const Z_TO_A = "z-a";

const ORDERBY_DATE = "date";
const ORDERBY_TITLE = "title";
const ORDER_ASC = "asc";
const ORDER_DESC = "desc";

const options = [
	{ label: "Newest to Oldest", value: NEWEST_TO_OLDEST },
	{ label: "Oldest to Newest", value: OLDEST_TO_NEWEST },
	{ label: "A → Z", value: A_TO_Z },
	{ label: "Z → A", value: Z_TO_A },
];

function getOptionValue(order, orderby) {
	if (order === ORDER_DESC && orderby === ORDERBY_DATE) {
		return NEWEST_TO_OLDEST;
	} else if (order === ORDER_ASC && orderby === ORDERBY_DATE) {
		return OLDEST_TO_NEWEST;
	} else if (order === ORDER_ASC && orderby === ORDERBY_TITLE) {
		return A_TO_Z;
	} else if (order === ORDER_DESC && orderby === ORDERBY_TITLE) {
		return Z_TO_A;
	} else return;
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
					<h2 className="pd-related-posts-setting-heading">Query</h2>
					<RangeControl
						label="Number of Posts"
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
						label="Include categories in query"
						checked={attributes.includeCategory}
						onChange={(value) =>
							setAttributes({ ...attributes, includeCategory: value })
						}
						help="Find posts that share same category as current post."
					/>
					<CheckboxControl
						label="Include tags in query"
						checked={attributes.includeTags}
						onChange={(value) =>
							setAttributes({ ...attributes, includeTags: value })
						}
						help="Find posts that share same tags as current post."
					/>
					<SelectControl
						label="Order by"
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
