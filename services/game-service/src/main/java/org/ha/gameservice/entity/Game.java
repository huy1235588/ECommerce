package org.ha.gameservice.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.validation.constraints.*;
import java.util.Date;
import java.util.List;
import java.util.Map;

@Document(collection = "games")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Game {

    @Id
    private String id;

    @Indexed(unique = true)
    @NotNull(message = "App ID is required")
    @Positive(message = "App ID must be positive")
    private Integer appId;

    @NotBlank(message = "Game type is required")
    private String type;

    @NotBlank(message = "Game name is required")
    @Size(min = 1, max = 500, message = "Game name must be between 1 and 500 characters")
    private String name;

    @Min(value = 0, message = "Required age cannot be negative")
    private Integer requiredAge;

    @NotNull(message = "Free status is required")
    private Boolean isFree;

    // Descriptions (100% required)
    @NotBlank(message = "Detailed description is required")
    private String detailedDescription;

    @NotBlank(message = "About the game is required")
    private String aboutTheGame;

    @NotBlank(message = "Short description is required")
    private String shortDescription;

    // Media Assets
    private String headerImage;
    private String capsuleImage;
    private String capsuleImagev5;
    private String background;
    private String backgroundRaw;

    private String website;

    // Arrays
    private List<Screenshot> screenshots;
    private List<Movie> movies;
    private List<Category> categories;
    private List<Genre> genres;
    private List<String> developers;
    private List<String> publishers;

    // Platform Requirements
    private PlatformRequirements pcRequirements;
    private PlatformRequirements macRequirements;
    private PlatformRequirements linuxRequirements;

    // Platform Support (100% required)
    @NotNull(message = "Platform information is required")
    private Platforms platforms;

    // Release Information (100% required)
    @NotNull(message = "Release date is required")
    private ReleaseDate releaseDate;

    // Pricing
    private List<Integer> packages;
    private PriceOverview priceOverview;
    private List<PackageGroup> packageGroups;

    // Achievements
    private Achievements achievements;

    // Recommendations
    private Recommendations recommendations;

    // Reviews
    private Reviews reviews;

    // Language Support
    private String languages;
    private String supportedLanguages;

    // Content Descriptors
    private ContentDescriptors contentDescriptors;

    // Ratings
    private Ratings ratings;

    // Support Information
    private SupportInfo supportInfo;

    // Tags/Metadata
    private Map<String, Object> tags;

    // Metacritic
    private Metacritic metacritic;

    // DLC Information
    private List<Integer> dlc;

    // Demo Information
    private List<Demo> demos;

    // Related Games
    private FullGame fullgame;

    // Timestamps
    private Date createdAt;
    private Date updatedAt;

    // Nested classes
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Screenshot {
        private Integer id;
        private String pathThumbnail;
        private String pathFull;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Movie {
        private Integer id;
        private String name;
        private String thumbnail;
        private MovieWebm webm;
        private MovieMp4 mp4;
        private Boolean highlight;
        private String dashAv1;
        private String dashH264;
        private String hlsH264;

        @Data
        @Builder
        @NoArgsConstructor
        @AllArgsConstructor
        public static class MovieWebm {
            private String _480;
            private String max;
        }

        @Data
        @Builder
        @NoArgsConstructor
        @AllArgsConstructor
        public static class MovieMp4 {
            private String _480;
            private String max;
        }
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Category {
        private Integer id;
        private String description;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Genre {
        private String id;
        private String description;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PlatformRequirements {
        private String minimum;
        private String recommended;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Platforms {
        private Boolean windows;
        private Boolean mac;
        private Boolean linux;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ReleaseDate {
        private Boolean comingSoon;
        private String date;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PriceOverview {
        private String currency;
        private Integer initial;
        private Integer finalPrice;
        private Integer discountPercent;
        private String initialFormatted;
        private String finalFormatted;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PackageGroup {
        private String name;
        private String title;
        private String description;
        private String selectionText;
        private String saveText;
        private Integer displayType;
        private String isRecurringSubscription;
        private List<PackageGroupSub> subs;

        @Data
        @Builder
        @NoArgsConstructor
        @AllArgsConstructor
        public static class PackageGroupSub {
            private Integer packageid;
            private String percentSavingsText;
            private Integer percentSavings;
            private String optionText;
            private String optionDescription;
            private String canGetFreeLicense;
            private Boolean isFreeLicense;
            private Integer priceInCentsWithDiscount;
        }
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Achievements {
        private Integer total;
        private List<AchievementHighlighted> highlighted;

        @Data
        @Builder
        @NoArgsConstructor
        @AllArgsConstructor
        public static class AchievementHighlighted {
            private String name;
            private String path;
        }
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Recommendations {
        private Integer total;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Reviews {
        private Integer positive;
        private Integer negative;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ContentDescriptors {
        private List<Integer> ids;
        private String notes;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Ratings {
        private RatingDejus dejus;
        private RatingSteamGermany steamGermany;

        @Data
        @Builder
        @NoArgsConstructor
        @AllArgsConstructor
        public static class RatingDejus {
            private String rating;
            private String descriptors;
        }

        @Data
        @Builder
        @NoArgsConstructor
        @AllArgsConstructor
        public static class RatingSteamGermany {
            private String ratingGenerated;
            private String rating;
            private String requiredAge;
            private String banned;
            private String useAgeGate;
            private String descriptors;
        }
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SupportInfo {
        private String url;
        private String email;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Metacritic {
        private Integer score;
        private String url;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Demo {
        private Integer appId;
        private String description;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class FullGame {
        private Integer appId;
        private String name;
    }
}