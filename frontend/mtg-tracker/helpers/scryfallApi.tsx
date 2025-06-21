export function getImageUrl(scryfallId: string, type: "normal" | "art_crop" = "normal") {
	return `https://cards.scryfall.io/${type}/front/${scryfallId[0]}/${scryfallId[1]}/${scryfallId}.jpg`;
}
