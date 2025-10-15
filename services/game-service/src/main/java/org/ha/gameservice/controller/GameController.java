package org.ha.gameservice.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.ha.commons.dto.response.ApiResponse;
import org.ha.commons.dto.response.PageResponse;
import org.ha.commons.dto.response.SuccessResponse;
import org.ha.gameservice.dto.CreateGameRequest;
import org.ha.gameservice.entity.Game;
import org.ha.gameservice.service.GameService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/games")
@RequiredArgsConstructor
@Slf4j
public class GameController {

    private final GameService gameService;

    @PostMapping
    public ResponseEntity<ApiResponse> createGame(@RequestBody CreateGameRequest game) {
        log.info("Received request to create game: {}", game.getName());
        Game createdGame = gameService.createGame(game);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(SuccessResponse.builder()
                        .data(createdGame)
                        .message("Game created successfully")
                        .build());
    }

    @PostMapping("/bulk")
    public ResponseEntity<ApiResponse> createGamesBulk(@RequestBody List<Game> games) {
        log.info("Received request to create bulk games, count: {}", games.size());
        List<Game> createdGames = gameService.createGames(games);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(SuccessResponse.builder()
                        .data(createdGames)
                        .message("Game created successfully")
                        .build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Game> getGameById(@PathVariable String id) {
        log.info("Received request to get game by id: {}", id);
        Optional<Game> game = gameService.getGameById(id);
        return game.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/appid/{appId}")
    public ResponseEntity<Game> getGameByAppId(@PathVariable Integer appId) {
        log.info("Received request to get game by appId: {}", appId);
        Optional<Game> game = gameService.getGameByAppId(appId);
        return game.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<ApiResponse> getAllGames(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        log.info("Received request to get all games, page: {}, size: {}", page, size);
        Pageable pageable = PageRequest.of(page - 1, size);
        Page<Game> games = gameService.getAllGames(pageable);

        return ResponseEntity
                .status(HttpStatus.ACCEPTED)
                .body(PageResponse.of(
                        games.getContent(),
                        games.getNumber() + 1,
                        games.getSize(),
                        games.getTotalElements()
                ));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Game> updateGame(@PathVariable String id, @RequestBody Game game) {
        log.info("Received request to update game with id: {}", id);
        try {
            Game updatedGame = gameService.updateGame(id, game);
            return ResponseEntity.ok(updatedGame);
        } catch (IllegalArgumentException e) {
            log.error("Error updating game: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGame(@PathVariable String id) {
        log.info("Received request to delete game with id: {}", id);
        try {
            gameService.deleteGame(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            log.error("Error deleting game: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/appid/{appId}")
    public ResponseEntity<Void> deleteGameByAppId(@PathVariable Integer appId) {
        log.info("Received request to delete game with appId: {}", appId);
        gameService.deleteGameByAppId(appId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/count")
    public ResponseEntity<Long> getTotalGamesCount() {
        log.info("Received request to get total games count");
        long count = gameService.getTotalGamesCount();
        return ResponseEntity.ok(count);
    }
}