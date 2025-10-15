package org.ha.gameservice.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.ha.gameservice.dto.CreateGameRequest;
import org.ha.gameservice.entity.Game;
import org.ha.gameservice.repository.GameRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class GameService {

    private final GameRepository gameRepository;

    public Game createGame(CreateGameRequest gameRequest) {
        log.info("Creating new game with appId: {}", gameRequest.getAppId());

        if (gameRepository.existsByAppId(gameRequest.getAppId())) {
            throw new IllegalArgumentException("Game with appId " + gameRequest.getAppId() + " already exists");
        }

        // Map CreateGameRequest to Game entity
        Game game = Game.builder()
                .appId(gameRequest.getAppId())
                .type(gameRequest.getType())
                .name(gameRequest.getName())
                .requiredAge(gameRequest.getRequiredAge())
                .isFree(gameRequest.getIsFree())
                .detailedDescription(gameRequest.getDetailedDescription())
                .aboutTheGame(gameRequest.getAboutTheGame())
                .shortDescription(gameRequest.getShortDescription())
                .headerImage(gameRequest.getHeaderImage())
                .capsuleImage(gameRequest.getCapsuleImage())
                .capsuleImagev5(gameRequest.getCapsuleImagev5())
                .background(gameRequest.getBackground())
                .backgroundRaw(gameRequest.getBackgroundRaw())
                .website(gameRequest.getWebsite())
                .screenshots(gameRequest.getScreenshots())
                .categories(gameRequest.getCategories())
                .genres(gameRequest.getGenres())
                .developers(gameRequest.getDevelopers())
                .publishers(gameRequest.getPublishers())
                .pcRequirements(gameRequest.getPcRequirements())
                .macRequirements(gameRequest.getMacRequirements())
                .linuxRequirements(gameRequest.getLinuxRequirements())
                .build();

        game.setCreatedAt(new Date());
        game.setUpdatedAt(new Date());

        Game savedGame = gameRepository.save(game);
        log.info("Successfully created game with id: {}", savedGame.getId());
        return savedGame;
    }

    public Optional<Game> getGameById(String id) {
        log.debug("Fetching game by id: {}", id);
        return gameRepository.findById(id);
    }

    public Optional<Game> getGameByAppId(Integer appId) {
        log.debug("Fetching game by appId: {}", appId);
        return gameRepository.findByAppId(appId);
    }

    public Page<Game> getAllGames(Pageable pageable) {
        log.debug("Fetching all games with pagination");
        return gameRepository.findAll(pageable);
    }

    public Game updateGame(String id, Game updatedGame) {
        log.info("Updating game with id: {}", id);

        Game existingGame = gameRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Game not found with id: " + id));

        // Check if appId is being changed and if it conflicts
        if (!existingGame.getAppId().equals(updatedGame.getAppId()) &&
            gameRepository.existsByAppId(updatedGame.getAppId())) {
            throw new IllegalArgumentException("Game with appId " + updatedGame.getAppId() + " already exists");
        }

        updatedGame.setId(id);
        updatedGame.setCreatedAt(existingGame.getCreatedAt());
        updatedGame.setUpdatedAt(new Date());

        Game savedGame = gameRepository.save(updatedGame);
        log.info("Successfully updated game with id: {}", id);
        return savedGame;
    }

    public void deleteGame(String id) {
        log.info("Deleting game with id: {}", id);

        if (!gameRepository.existsById(id)) {
            throw new IllegalArgumentException("Game not found with id: " + id);
        }

        gameRepository.deleteById(id);
        log.info("Successfully deleted game with id: {}", id);
    }

    public void deleteGameByAppId(Integer appId) {
        log.info("Deleting game with appId: {}", appId);
        gameRepository.deleteByAppId(appId);
        log.info("Successfully deleted game with appId: {}", appId);
    }

    public long getTotalGamesCount() {
        return gameRepository.count();
    }

    public List<Game> createGames(List<Game> games) {
        log.info("Creating bulk games, count: {}", games.size());

        List<Game> validGames = new ArrayList<>();
        List<Integer> duplicateAppIds = new ArrayList<>();

        for (Game game : games) {
            if (gameRepository.existsByAppId(game.getAppId())) {
                duplicateAppIds.add(game.getAppId());
            } else {
                game.setCreatedAt(new Date());
                game.setUpdatedAt(new Date());
                validGames.add(game);
            }
        }

        if (!duplicateAppIds.isEmpty()) {
            log.warn("Skipping games with duplicate appId: {}", duplicateAppIds);
        }

        List<Game> savedGames = gameRepository.saveAll(validGames);
        log.info("Successfully created {} games", savedGames.size());
        return savedGames;
    }
}