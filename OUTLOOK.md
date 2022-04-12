The general outlook for the project will be described here



1. Looking for an API

At first I found the Api-football api that allowed around 100 reqs per day on a free basis but it had a difficult API key authorisation system. For using chainlink with APIs that need authorisation, we must use : https://blog.chain.link/oauth-and-api-authentication-in-smart-contracts-2/.

However, later I found a public API for sports data that lists data as aJSON file publicly on HTTPS without an HTTPS link which would make it easier to be passed to our Chainlink oracle (https://www.thesportsdb.com/api.php).

In the end, the Chainlink's big data parser code worked so now we can read strings from public REST API's as well => we will be using Firebase with our random data for now. 

However, our aim will be to sructure the data as close as possible ot the API-FOOTBALL api. 

2. Data on servers

So in our Firebase Database we might have to use a couple of tables. As of now I can see the need for the following tables:
	- fixtures (will be basicaly copy of API-football)
	- bets (will be on FireBase)
		- matchId
			-winnerBets
				- homeBets
				- awayBets
