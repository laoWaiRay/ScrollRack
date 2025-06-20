export function getImageUrl(scryfallId: string) {
	return `https://cards.scryfall.io/normal/front/${scryfallId[0]}/${scryfallId[1]}/${scryfallId}.jpg`;
}
