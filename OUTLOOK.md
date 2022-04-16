The general outlook for the project will be described here



1. Looking for an API

We will be using the sportsdb database API for data about live matches, and future/past fixtures. Their API will be ppurchased on Patreon on 5$ per month. They give a unique API key which I will share as a link to ChainLink host and it will fetch the results when required. 

2. Data on servers

So in our Firebase Database we might have to use a couple of tables. As of now I can see the need for the following tables:
	- fixtures (will be basicaly copy of API-football)
	- bets (will be on FireBase)
		- matchId
			-winnerBets
				- homeBets
				- awayBets
