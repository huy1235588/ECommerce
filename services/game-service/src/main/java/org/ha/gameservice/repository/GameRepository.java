package org.ha.gameservice.repository;

import org.ha.gameservice.entity.Game;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GameRepository extends MongoRepository<Game, String> {

    Optional<Game> findByAppId(Integer appId);

    List<Game> findByType(String type);

    List<Game> findByIsFree(Boolean isFree);

    @Query("{ 'genres.description': ?0 }")
    List<Game> findByGenre(String genre);

    @Query("{ 'categories.description': ?0 }")
    List<Game> findByCategory(String category);

    @Query("{ 'platforms.windows': true }")
    List<Game> findWindowsGames();

    @Query("{ 'platforms.mac': true }")
    List<Game> findMacGames();

    @Query("{ 'platforms.linux': true }")
    List<Game> findLinuxGames();

    @Query("{ 'price_overview.final': { $gte: ?0, $lte: ?1 } }")
    List<Game> findByPriceRange(Integer minPrice, Integer maxPrice);

    @Query("{ 'name': { $regex: ?0, $options: 'i' } }")
    List<Game> findByNameContaining(String name);

    boolean existsByAppId(Integer appId);

    void deleteByAppId(Integer appId);
}