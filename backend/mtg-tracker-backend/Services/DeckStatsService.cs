using AutoMapper;
using Mtg_tracker.Models;
using Mtg_tracker.Models.DTOs;

namespace Mtg_tracker.Services;

public class DeckStatsService(IMapper mapper)
{
    private readonly IMapper _mapper = mapper;

    public DeckReadDTO? ComputeMostRecentPlayedDeckStats(List<GameParticipation> filteredGameParticipations)
    {
        var mostRecentPlayedDeck = filteredGameParticipations.FirstOrDefault()?.Deck;
        if (mostRecentPlayedDeck == null)
            return null;

        var mrpdGameParticipations = filteredGameParticipations
            .Where(gp => gp.DeckId == mostRecentPlayedDeck.Id)
            .ToList();

        var mrpdIsWinStreak = mrpdGameParticipations.FirstOrDefault()?.Won;

        var mrpdStreak = mrpdGameParticipations
            .TakeWhile(gp => gp.Won == mrpdIsWinStreak && !gp.Game.Imported)
            .Count();

        int mrpdCurrWinStreak = 0;
        int mrpdCurrLossStreak = 0;
        int mrpdLongestWinStreak = 0;
        int mrpdLongestLossStreak = 0;
        foreach (var gp in mrpdGameParticipations)
        {
            mrpdCurrWinStreak = gp.Won ? mrpdCurrWinStreak + 1 : 0;
            mrpdCurrLossStreak = !gp.Won ? mrpdCurrLossStreak + 1 : 0;
            mrpdLongestWinStreak = Math.Max(mrpdCurrWinStreak, mrpdLongestWinStreak);
            mrpdLongestLossStreak = Math.Max(mrpdCurrLossStreak, mrpdLongestLossStreak);
        }

        var winningGameLengths = mrpdGameParticipations
            .Where(gp => gp.Won)
            .Select(gp => gp.Game.Seconds)
            .ToList();

        var fastestWinInSeconds = winningGameLengths.Count > 0 ? winningGameLengths.Min() : 0;
        var slowestWinInSeconds = winningGameLengths.Count > 0 ? winningGameLengths.Max() : 0;

        var parsByPodSize = mrpdGameParticipations
            .GroupBy(gp => gp.Game.NumPlayers)
            .Select(group => 1.0 / group.Key * group.Count());

        double par = 0.0;
        if (parsByPodSize != null && mrpdGameParticipations != null)
        {
            par = parsByPodSize.Aggregate(0.0, (current, next) => current + next);
            if (mrpdGameParticipations.Count > 0)
                par /= mrpdGameParticipations.Count;
            else
                par = 0.0;
        }

        var mrpdNumGames = filteredGameParticipations.Count(gp => gp.DeckId == mostRecentPlayedDeck.Id);
        var mrpdNumWins = filteredGameParticipations.Count(gp => gp.DeckId == mostRecentPlayedDeck.Id && gp.Won);

        var mrpdDTO = _mapper.Map<DeckReadDTO>(mostRecentPlayedDeck);
        mrpdDTO.NumGames = mrpdNumGames;
        mrpdDTO.NumWins = mrpdNumWins;
        mrpdDTO.LatestWin = mrpdGameParticipations?.Where(gp => gp.Won && !gp.Game.Imported).FirstOrDefault()?.CreatedAt;
        mrpdDTO.CurrentStreak = mrpdStreak;
        mrpdDTO.IsCurrentWinStreak = mrpdIsWinStreak;
        mrpdDTO.LongestWinStreak = mrpdLongestWinStreak;
        mrpdDTO.LongestLossStreak = mrpdLongestLossStreak;
        mrpdDTO.FastestWinInSeconds = fastestWinInSeconds;
        mrpdDTO.SlowestWinInSeconds = slowestWinInSeconds;
        mrpdDTO.Par = par;

        return mrpdDTO;
    }
}