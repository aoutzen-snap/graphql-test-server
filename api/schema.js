// import { buildSchema } from "graphql";

// const schema = buildSchema(`
//     type Query {
//         helloWorld: String!
//     }
// `);

const typeDefs = `
    """
    Top-level fields that perform API read operations.
    """
    type Query {
        helloWorld: String!

        """
        Retrieve a single Game by its unique ID. If no Game is found, returns null.
        """
        getGame(id: ID!): Game

        """
        Retrieve Games for any of the provided unique IDs. Results are provided in the same order IDs are given.
        If no Game is found for an ID, returns null.
        """
        getGamesWithIds(ids: [ID!]!): [Game]!

        """
        Retrieve all Games.
        """
        getGames: [Game!]!

        """
        Retrieve all Games with critic scores that fall within the given range.
        At least one of the inputs is required - if both score range endpoint inputs are missing, an error occurs.
        It is valid to provide only one input to set an inclusive floor or ceiling.
        """
        getGamesInScoreRange("The minimum end of the score range." minScore: Float, "The maximum end of the score range." maxScore: Float): [Game!]!

        """
        Retrieve all Games that fit the criteria defined in the FilterInput.
        """
        getGamesFiltered(filterInput: FilterInput!): [Game!]!

        """
        Retrieve a single Developer by its unique ID. If no Developer is found, returns null.
        """
        getDeveloper(id: ID!): Developer

        """
        Retrieve a single Platform by its unique ID. If no Platform is found returns null.
        """
        getPlatform(id: ID!): Platform
    }

    """
    Top-level fields that perform API write operations.
    """
    type Mutation {
        """
        Add a new Game based on the provided GameInput. 
        If the ID of an existing Developer is included, the created Game is added to the Developer's "games" field.
        """
        addGame(gameInput: GameInput!): Game!

        """
        Update the critic score of an existing Game.
        """
        updateGameScore(id: ID!, score: Float!): Game!

        """
        Add a new Developer based on the provided DeveloperInput.
        If one or more existing Game IDs are provided, the created Developer is set on each Game's "developer" field.
        """
        addDeveloper(developerInput: DeveloperInput!): Developer!

        """
        Add a new Platform based on the provided PlatformInput.
        """
        addPlatform(platformInput: PlatformInput!): Platform!
    }

    """
    An enum representing the available ESRB ratings.
    """
    enum EsrbRating {
        EARLYCHILDHOOD
        EVERYONE
        EVERYONE10PLUS
        TEEN
        MATURE
        ADULTSONLY
        NOTRATED
    }

    """
    Type representing a video game.
    """
    type Game {
        """
        The unique ID of the game.
        """
        id: ID!

        """
        The name of the game.
        """
        name: String!

        """
        The year in which the game was first released.
        """
        releaseYear: Int

        """
        The genre of the game.
        """
        genre: String

        """
        The average Metacritic critic score of a game, represented on a 100 point, 0 to 10 scale.
        """
        criticScore: Float

        """
        The ESRB rating of the game.
        """
        esrbRating: EsrbRating

        """
        The developer of the game.
        """
        developer: Developer

        """
        The platforms the game appears on.
        """
        platforms: [Platform!]!

        """
        Can you pet the dog in this game? Can be true, false, or null if it is not known whether you can pet the dog.
        """
        canYouPetTheDog: Boolean
    }

    """
    Type representing a game developer.
    """
    type Developer {
        """
        The unique ID of the developer.
        """
        id: ID!
        
        """
        The name of the developer.
        """
        name: String!
        
        """
        The year the developer was originally founded.
        """
        yearFounded: Int!

        """
        The games the developer has created.
        """
        games: [Game!]!
    }

    """
    Type representing a video game media platform/console.
    """
    type Platform {
        """
        The unique ID of the platform.
        """
        id: ID!
        
        """
        The name of the platform.
        """
        name: String!

        """
        The name of the company that manufactured the platform.
        """
        manufacturerName: String!

        """
        The year the platform was originally released.
        """
        releaseYear: Int

        """
        The original price of the platform.
        """
        price: Float
    }

    """
    An input for filter to narrow down a search.
    """
    input FilterInput {
        """
        The ESRB rating that should be accepted by the filter.
        """
        esrbRating: EsrbRating

        """
        The year of release that should be accepted by the filter.
        """
        releaseYear: Int

        """
        The minimum critic score that should be accepted by the filter.
        """
        minScore: Float

        """
        The boolean indicator of whether the dog can be pet that should be accepted by the filter.
        """
        canYouPetTheDog: Boolean
    }

    """
    An input for a new video game.
    """
    input GameInput {
        """
        The name of the game.
        """
        name: String!

        """
        The year in which the game was first released.
        """
        releaseYear: Int

        """
        The genre of the game.
        """
        genre: String

        """
        The average Metacritic critic score of a game, represented on a 100 point, 0 to 10 scale.
        """
        criticScore: Float

        """
        The ESRB rating of the game.
        """
        esrbRating: EsrbRating

        """
        The platforms the game appears on.
        """
        platformIds: [ID!]

        """
        The developer of the game.
        """
        developerId: ID

        """
        Can you pet the dog in this game? Can be true, false, or null if it is not known whether you can pet the dog.
        """
        canYouPetTheDog: Boolean
    }

    """
    An input for a new game developer.
    """
    input DeveloperInput {
        """
        The name of the developer.
        """
        name: String!

        """
        The year the developer was originally founded.
        """
        yearFounded: Int!

        """
        The games the developer has created.
        """
        gameIds: [ID!]
    }

    """
    An input for a new platform/console.
    """
    input PlatformInput {
        """
        The name of the platform.
        """
        name: String!

        """
        The name of the company that manufactured the platform.
        """
        manufacturerName: String!

        """
        The year the platform was originally released.
        """
        releaseYear: Int

        """
        The original price of the platform.
        """
        price: Float
    }
`

export default typeDefs;