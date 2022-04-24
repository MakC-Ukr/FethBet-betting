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


3. For frontend's basic services we might use thirdweb. After all, why reinvent the wheel every time. BE more efficient.

4. Data for upcoming matches will be loaded inside the BetPageTable component and used only there. From there the user will see the button to place a bet on a specific match. And then a new page will open with more details of the match. The data loaded inside the tabel will probably not be used by any component to we will store it in the Table's state only. Also, when a user will place a bet, we will have to store a user's placed bets with us on our server in order be more efficient in loaidn it later. 