/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').options & import('@ianvs/prettier-plugin-sort-imports).options} */
const config = {
	endOfLine: "lf",
	semi: false,
	singleQuote: false,
	tabWidth: 2,
	useTabs: true,
	trailingComma: "es5",
	importOrder: [
		"^(axios/(.*)$)|^(axios$)",
		"^(express/(.*)$)|^(express$)",
		"^(react/(.*)$)|^(react$)",
		"^(react-router/(.*)$)|^(react-router$)",
		"^(react-router-dom/(.*)$)|^(react-router-dom$)",
		"",
		"^(next/(.*)$)|^(next$)",
		"<THIRD_PARTY_MODULES>",
		"",
		"^types$",
		"^@/types/(.*)$",
		"^@/config/(.*)$",
		"^@lib/(.*)$",
		"^@/lib/(.*)$",
		"^@/hooks/(.*)$",
		"",
		"^@components/(.*)$",
		"^@/components/ui/(.*)$",
		"^@/components/(.*)$",
		"",
		"^@/registry/(.*)$",
		"^@/styles/(.*)$",
		"^@/app/(.*)$",
		"",
		"^@/(.*)$",
		"^[./]",
	],
	importOrderSeparation: false,
	importOrderSortSpecifiers: true,
	importOrderBuiltinModulesToTop: true,
	importOrderMergeDuplicateImports: true,
	importOrderCombineTypeAndValueImports: true,
	importOrderParserPlugins: ["typescript", "jsx", "tsx", "ts", "js", "mjs"],
	plugins: [
		"@ianvs/prettier-plugin-sort-imports",
		"prettier-plugin-tailwindcss",
	],
	importTransform: {
		"@/components": "@components",
	},
	tailwindFunctions: [
		"clsx",
		"tw",
		"apply",
		"theme",
		"variants",
		"e",
		"screen",
		"cn",
	],
}

export default config
