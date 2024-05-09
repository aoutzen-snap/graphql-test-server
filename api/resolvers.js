const mockGamesDatabase = {
    1: {name: "Destiny", releaseYear: 2014, criticScore: 7.6, esrbRating: "TEEN", platformIds: [2,3,4,5], developerId: 1},
    2: {name: "Horizon Zero Dawn", releaseYear: 2017, criticScore: 8.9, esrbRating: "TEEN", platformIds: [4], developerId: 15, canYouPetTheDog: true},
    3: {name: "Halo 3", releaseYear: 2007, criticScore: 9.4, esrbRating: "MATURE", platformIds: [3], developerId: 1},
    4: {name: "Call of Duty 4: Modern Warfare", releaseYear: 2007, criticScore: 9.4, esrbRating: "MATURE", platformIds: [2,3], canYouPetTheDog: false},
    5: {name: "Metroid Dread", releaseYear: 2021, criticScore: 8.8, esrbRating: "TEEN", platformIds: [1], developerId: 3, canYouPetTheDog: false},
    6: {name: "Horizon Forbidden West", releaseYear: 2022, criticScore: 8.8, esrbRating: "TEEN", platformIds: [4,5], developerId: 15, canYouPetTheDog: true}
};
const mockDevelopersDatabase = {
    1: {name: "Bungie", yearFounded: 1991, gameIds: [1,3]},
    2: {name: "Guerrilla Games", yearFounded: 2000, gameIds: [2,6]},
    3: {name: "MercurySteam", yearFounded: 2002, gameIds: [5]}
};
const mockPlatformsDatabase = {
    1: {name: "Switch", manufacturerName: "Nintendo", releaseYear: 2017, price: 299.99},
    2: {name: "PlayStation 3", manufacturerName: "Sony", releaseYear: 2006, price: 499.99},
    3: {name: "Xbox 360", manufacturerName: "Microsoft", releaseYear: 2005, price: 399.99},
    4: {name: "PlayStation 4", manufacturerName: "Sony", releaseYear: 2013, price: 399.99},
    5: {name: "Xbox One", manufacturerName: "Microsoft", releaseYear: 2013, price: 499.99},
    6: {name: "PlayStation 5", manufacturerName: "Sony", releaseYear: 2020, price: 499.99},
    7: {name: "Xbox Series X", manufacturerName: "Microsoft", releaseYear: 2020, price: 499.99},
    8: {name: "Xbox", manufacturerName: "Microsoft", releaseYear: 2001, price: 299.99}
};

const resolvers = {
    Query: {
        helloWorld: () => {
            return "Hello there! I am Ben Kenobi.";
        },
        getGame: (_, { id }) => {
            var gameData = mockGamesDatabase[id];
            return (gameData === undefined || gameData === null) ? null : {id: id, ...gameData};
        },
        getGamesWithIds: (_, { ids }) => {
            var gamesArray = [];
            for (var id of ids) {
                console.log(`Checking for game with id ${id}...`);
                var gameData = mockGamesDatabase[id];
                // TODO Maybe if an id is not present we throw an error - how do we do errors in GraphQL that don't stop all processing?
                // TODO Maybe it would require a union type such that we can return a custom error/type structure.
                // if (gameData === undefined || gameData === null) {
                //     console.log('No game found');
                //     throw Error(`Error: no game data found for id ${id}`);
                // } else {
                //     console.log('Game found!');
                //     gamesArray.push({id: id, ...gameData});
                // }
                var game = (gameData === undefined || gameData === null) ? null : {id: id, ...gameData};
                gamesArray.push(game);
            }
            return gamesArray;
        },
        getGames: () => {
            var gamesArray = [];
            for (var id in mockGamesDatabase) {
                if (mockGamesDatabase.hasOwnProperty(id)) {
                    var game = {id: id, ...mockGamesDatabase[id]};
                    gamesArray.push(game);
                }
            }
            return gamesArray;
        },
        getGamesInScoreRange: (_, { minScore, maxScore }) => {
            var minScoreMissing = minScore === undefined || minScore === null;
            var maxScoreMissing = maxScore === undefined || maxScore === null
            if (minScoreMissing && maxScoreMissing) {
                throw new Error(`Error: Cannot get games in score range. At least one of minimum or maximum score must be present`);
            }
            if ((!minScoreMissing && !maxScoreMissing) && maxScore < minScore) {
                throw new Error(`Error: Cannot get games in Score range. Max score must be greater than or equal to min score`);
            }
            var gamesArray = [];

            for (var gameId in mockGamesDatabase) {
                var gameData = mockGamesDatabase[gameId];
                var gameScore = gameData["criticScore"];
                if ((!minScoreMissing && !maxScoreMissing)) {
                    if (gameScore >= minScore && gameScore <= maxScore) {
                        gamesArray.push({id: gameId, ...gameData});
                    }
                    // Push if between min and max (both inclusive)
                } else if (!minScoreMissing && gameScore >= minScore) {
                    gamesArray.push({id: gameId, ...gameData});
                    // Push if greater than/equal to min
                } else if (!maxScoreMissing && gameScore <= maxScore) {
                    gamesArray.push({id: gameId, ...gameData});
                    // Push if less than/equal to max
                }
            }
            return gamesArray;
        },
        getGamesFiltered: (_, { filterInput }) => {
            // todo this doesn't work right for canYouPetTheDog: null
            var games = [];
            for (var id in mockGamesDatabase) {
                games.push({id: id, ...mockGamesDatabase[id]});
            }
            for (var filteredAttribute in filterInput) {
                if (games.length === 0) {
                    break;
                }
                var filterAttrValue = filterInput[filteredAttribute];
                var index = 0;
                while (index < games.length) {
                    var gameAttrValue;
                    if (filteredAttribute === 'minScore') {
                        gameAttrValue = games[index]['criticScore'];
                    } else {
                        gameAttrValue = games[index][filteredAttribute]
                    }
                    if (filteredAttribute === 'minScore') {
                        if (gameAttrValue >= filterAttrValue) {
                            index++;
                        } else {
                            games.splice(index, 1);
                        }
                    } else {
                        if (gameAttrValue === filterAttrValue || 
                            (filterAttrValue === null && gameAttrValue === undefined)) {
                            index++;
                        } else {
                            games.splice(index, 1);
                        }
                    }
                }
            }
            return games;
        },
        getDeveloper: (_, { id }) => {
            var devData = mockDevelopersDatabase[id];
            return (devData === undefined || devData === null) ? null : {id: id, ...devData};
        },
        getPlatform: (_, { id }) => {
            var platformData = mockPlatformsDatabase[id];
            return (platformData === undefined || platformData === null) ? null : {id: id, ...platformData};
        }
    },
    Mutation: {
        addGame: (_, { gameInput }) => {
            var newId = Object.keys(mockGamesDatabase).length + 1;
            if (gameInput["developerId"] !== undefined && gameInput["developerId"] !== null) {
                var developerId = gameInput["developerId"];
                var developerData = mockDevelopersDatabase[developerId];
                if (developerData !== undefined && developerData !== null) {
                    if (developerData["gameIds"] === undefined || developerData["gameIds"] === null) {
                        developerData["gameIds"] = [newId];
                    } else {
                        developerData["gameIds"].push(newId);
                    }
                } else {
                    throw new Error(`Error: Failed to add Game. Unable to create reciprocal link to Game with id ${newId} 
                                    on Developer with id ${developerId}: Developer with id ${developerId} was not found`);
                }
            }
            mockGamesDatabase[newId] = gameInput;
            return {id: newId, ...gameInput};
        },
        updateGameScore: (_, { id, score }) => {
            var gameData = mockGamesDatabase[id];
            if (gameData === undefined || gameData === null) {
                throw new Error(`Error: Failed to update Game score. Game with id ${id} was not found`)
            }
            gameData["criticScore"] = score;
            mockGamesDatabase[id] = gameData;
            return {id: id, ...gameData};
        },
        addDeveloper: (_, { developerInput }) => {
            var newId = Object.keys(mockDevelopersDatabase).length + 1;
            if (developerInput["gameIds"] !== undefined && developerInput["gameIds"] !== null) {
                var gameIds = developerInput["gameIds"];
                for (var gameId of gameIds) {
                    var gameData = mockGamesDatabase[gameId];
                    if (gameData !== undefined && gameData !== null) {
                        gameData["developerId"] = newId;
                    } else {
                        throw new Error(`Error: Failed to add Developer. Unable to create reciprocal link to Developer with 
                                        id ${newId} on Game with id ${gameId}: Game with id ${gameId} was not found`);
                    }
                }
            }
            mockDevelopersDatabase[newId] = developerInput;
            return {id: newId, ...developerInput};
        },
        addPlatform: (_, { platformInput }) => {
            var newId = Object.keys(mockPlatformsDatabase).length + 1;
            mockPlatformsDatabase[newId] = platformInput;
            return {id: newId, ...platformInput};
        }
    },
    Game: {
        developer: (resolvedGame) => {
            var developerId = resolvedGame.developerId;
            if (developerId === undefined || developerId === null) {
                return null;
            } else {
                var developerData = mockDevelopersDatabase[developerId];
                if (developerData === undefined || developerData === null) {
                    throw new Error(`Error: no data found for linked developer`);
                }
                return {id: developerId, ...mockDevelopersDatabase[developerId]};
            }
        },
        platforms: (resolvedGame) => {
            var platformIds = resolvedGame.platformIds;
            if (platformIds === undefined || platformIds === null) {
                return [];
            }
            var platforms = [];
            for (var id of platformIds) {
                var platformData = mockPlatformsDatabase[id];
                if (platformData !== undefined && platformData !== null) {
                    platforms.push({id: id, ...platformData});
                }
            }
            return platforms;
        }
    },
    Developer: {
        games: (resolvedDeveloper) => {
            var gameIds = resolvedDeveloper.gameIds;
            if (gameIds === undefined || gameIds === null) {
                return [];
            }
            var games = [];
            for (var gameId of gameIds) {
                var gameData = mockGamesDatabase[gameId];
                if (gameData !== undefined && gameData !== null) {
                    games.push({id: gameId, ...gameData});
                }
            }
            return games;
        }
    }
}

export default resolvers;