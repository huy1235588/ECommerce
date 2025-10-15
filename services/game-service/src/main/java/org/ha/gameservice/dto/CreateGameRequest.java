package org.ha.gameservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import org.ha.gameservice.entity.Game;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateGameRequest {

    @NotNull(message = "App ID is required")
    @Positive(message = "App ID must be positive")
    private Integer appId;

    @NotBlank(message = "Game type is required")
    private String type;

    @NotBlank(message = "Game name is required")
    private String name;

    private Integer requiredAge;

    @NotNull(message = "Free status is required")
    private Boolean isFree;

    @NotBlank(message = "Detailed description is required")
    private String detailedDescription;

    @NotBlank(message = "About the game is required")
    private String aboutTheGame;

    @NotBlank(message = "Short description is required")
    private String shortDescription;

    private String headerImage;
    private String capsuleImage;
    private String capsuleImagev5;
    private String background;
    private String backgroundRaw;
    private String website;

    private List<Game.Screenshot> screenshots;
    private List<Game.Category> categories;
    private List<Game.Genre> genres;
    private List<String> developers;
    private List<String> publishers;

    private Game.PlatformRequirements pcRequirements;
    private Game.PlatformRequirements macRequirements;
    private Game.PlatformRequirements linuxRequirements;

    @NotNull(message = "Platform information is required")
    private Game.Platforms platforms;

    @NotNull(message = "Release date is required")
    private Game.ReleaseDate releaseDate;

    private List<Integer> packages;
    private Game.PriceOverview priceOverview;
    private List<Game.PackageGroup> packageGroups;

    private Game.Achievements achievements;
    private Game.Recommendations recommendations;
    private Game.Reviews reviews;

    private String languages;
    private String supportedLanguages;
    private Game.ContentDescriptors contentDescriptors;
    private Game.Ratings ratings;
    private Game.SupportInfo supportInfo;
}