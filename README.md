# BubbleBurster

## Summary
This is a Bubble Bursting game built on Polkadot (currently with Shibuya Testnet). In this game, players can pay 1 DOT and play the game and win prizes

## Description
This game is built with a React based frontend and smart contract in solidity which is deployed on Polkadot chain (On Shibuya Testnet for now but can easily be deployed on Mainnet as well following the same method)

In this game, the player can click on the "Play" button which would initiate the play by requesting the player to send 1 DOT to the contract (It would first required user to connect the wallet if not already connected to the site).

When user confirms the transaction, it will wait for it to be successful and then start a countdown with a horn sound so that player can get ready to start bursting.

The player should aim to burst all the bubbles within 60 seconds. At each burst the bubbles split into two smaller bubbles and smallest size bubble burst and disappears

If the player is able to burst all the bubbles, they will receive a prize of 2 DOT back.

If the player is not able to burst all the bubbles, they will still receive some reward back based on the percentage of bubbles they have burst completely.

At the end of the game, it will ask again for player to confirm the transaction for Payback. Once they confirm it, they will receive the appropriate reward back.

## Technical Description
Game built using React, HTML, JavaScript, CSS
Smart contract built using Solidity
Contract deployed on Shibuya Testnet for now
With the gaming environment booming on Polkadot, it will be helpful to improve on this game by introducing future features such as - 
1. Automatic claim for payback without user cnofirming another transaction.
2. Option to select different difficulty Level for respective price and corresponding rewards so that players of all skill level can play.
3. Option to Bet More! & Win More!

With Polkadot's NFT infrastructure, I would also like to include feature where I can integrate a player body in the game that would shoot arrows to burst the bubbles and top players can create their own skin and sell it as NFT and other players can use those NFT to play the game. We can also make different NFTs have different attributes that would allow the game to be played with different guns for different NFTs that would make the game more interesting.

## Game Flow - 

### 1. First Connect to Wallet if not already connected
<img width="1425" alt="Screenshot 2024-07-28 at 11 05 45 AM" src="https://github.com/user-attachments/assets/eb643256-0199-44f4-a1dc-9bc3a70545e2">

### 2. Once connected, it shows the connected account
<img width="415" alt="Screenshot 2024-07-28 at 11 05 57 AM" src="https://github.com/user-attachments/assets/b124c943-349d-4e58-80b2-f4554782694b">

### 3. When we click on Play, it pop up Metamask to confirm transaction of 1 DOT (In this case Test Token of 1 Shibuya)
<img width="1424" alt="Screenshot 2024-07-28 at 11 06 27 AM" src="https://github.com/user-attachments/assets/41fc872f-5852-4458-8704-d52f67abd0ed">

### 4. As soon as the transaction confirms, the game starts and timer of 60 seconds start
<img width="1246" alt="Screenshot 2024-07-28 at 11 06 50 AM" src="https://github.com/user-attachments/assets/8657f0db-97b2-4bdb-9c23-a8ead97fb6db">

### 5. Keep on bursting bubbles till they are smallest size and eventually pops up
<img width="1341" alt="Screenshot 2024-07-28 at 11 07 43 AM" src="https://github.com/user-attachments/assets/ce04bb46-41a4-48fc-99bd-1be389b065f5">

### 6. When the game ends, another metamask pop up shows up to claim the playback
<img width="1414" alt="Screenshot 2024-07-28 at 11 07 55 AM" src="https://github.com/user-attachments/assets/d37d2d50-b594-4aa7-ba3f-1d7e8748cfde">

### 7. At the end the payback is received and game ends
<img width="1396" alt="Screenshot 2024-07-28 at 11 08 13 AM" src="https://github.com/user-attachments/assets/bb41e9d9-36f8-4b27-b2ad-f47d69636cc8">






