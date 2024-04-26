const { default: puppeteer } = require("puppeteer");
require("dotenv").config({
	path: "./.env",
	override: true,
});

const { LOGIN_URL, USERNAME, PASSWORD } = process.env;

beforeAll(async () => {
	const browser = await puppeteer.launch({ headless: false });
	const page = await browser.newPage();
	await page.setViewport({
		width: 1366,
		height: 760,
	});
	await page.goto(LOGIN_URL);
	await page.type("input#user_login", USERNAME);
	await page.type("input#user_pass", PASSWORD);
	await page.click("input#wp-submit");
	await page.waitForResponse(
		(response) => response.url() === LOGIN_URL && response.status() === 200
	);
}, 10000);

it("Check wordpress plugin and install", async () => {
	await page.click("a.menu-icon-plugins");
	await page.waitForResponse(
		(response) =>
			response.url() === `${LOGIN_URL}` && response.status() === 200
	);
	await page.click("a.page-title-action");
	await page.type("input#wp-filter-search", "WP Dark Mode");
	await page.click("div#the-list .plugin-card-wp-dark-mode a.install-now");
});
it("Activate The Plugin", async () => {
	// setTimeout(15000);
	await page
		.$("div#the-list .plugin-card-wp-dark-mode a.activate-now")
		.click();
});
