import getBaseUrl from "./baseURL";

function getImgUrl(name) {
	return new URL(getBaseUrl() + "/uploads/" + name, import.meta.url);
}

export { getImgUrl };
