import React, { useEffect, useRef, useState, useCallback } from 'react';
import './App.css';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import Canvas from './components/Canvas';
import Timer from './components/Timer';
import GameOver from './components/GameOver';
import Web3 from 'web3';
import contractjson from './details/contract.json';

let contract = null;
let selectedAccount = null;
const ADDRESS = "0x97C2f7c1040179FE976708c65642176B540ad7e2";

const loadedData = JSON.stringify(contractjson);
const abi = JSON.parse(loadedData);

function App() {
  const [bubbles, setBubbles] = useState([]);
  const [gameTime, setGameTime] = useState(80);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const canvasRef = useRef(null);
  const requestRef = useRef();
  const [selected, setSelected] = useState(null);
  const [countdown, setCountdown] = useState(3);
  const [countdownStarted, setCountdownStarted] = useState(false);
  const [gameRunning, setGameRunning] = useState(false);
  const [hornSound, setHornSound] = useState(null);

  useEffect(() => {
    setHornSound(new Audio('horn.mp3'));
  }, []);

  let publicCost = 2000000000000000000;

  useEffect(() => {
    async function checkNetwork() {
      let provider = window.ethereum;
      const web3 = new Web3(provider);
      provider.on('chainChanged', function () {
        window.location.reload();
      });
      provider.on('accountsChanged', function (accounts) {
        if (accounts.length > 0) {
          selectedAccount = accounts[0];
          setSelected(selectedAccount.slice(0, 5) + '...' + selectedAccount.slice(-4));
          console.log('Selected Account change is' + selectedAccount);
        } else {
          window.location.reload();
          console.error('No account is found');
        }
      });
      let accounts = await web3.eth.getAccounts();
      if (accounts.length > 0) {
        selectedAccount = accounts[0];
        setSelected(selectedAccount.slice(0, 5) + '...' + selectedAccount.slice(-4));
      }
    }
    checkNetwork();
  }, []);

  async function onConnectClick() {
    let provider = window.ethereum;
    if (typeof provider !== 'undefined') {
      provider
        .request({ method: 'eth_requestAccounts' })
        .then((accounts) => {
          selectedAccount = accounts[0];
          setSelected(selectedAccount.slice(0, 5) + '...' + selectedAccount.slice(-4));
          console.log('Selected Account is ' + selectedAccount);
        })
        .catch((err) => {
          console.log(err);
        });

      provider.on('chainChanged', function () {
        window.location.reload();
      });

      provider.on('accountsChanged', function (accounts) {
        if (accounts.length > 0) {
          selectedAccount = accounts[0];
          console.log('Selected Account change is' + selectedAccount);
        } else {
          window.location.reload();
          console.error('No account is found');
        }
      });

      provider.on('message', function (message) {
        console.log(message);
      });

      provider.on('connect', function (info) {
        console.log('Connected to network ' + info);
      });

      provider.on('disconnect', function (error) {
        console.log('Disconnected from network ' + error);
        window.location.reload();
      });
    } else {
      NotificationManager.error('Please connect with metamask wallet', '', 3000);
    }
  }

  const drawBubbles = useCallback((ctx, bubbles) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    bubbles.forEach((bubble) => {
      ctx.beginPath();
      ctx.arc(bubble.x, bubble.y, bubble.size, 0, Math.PI * 2);
      ctx.fillStyle = '#d81b60';
      ctx.fill();
      ctx.closePath();
    });
  }, []);

  const updateBubbles = useCallback((bubbles, canvas) => {
    return bubbles.map((bubble) => {
      bubble.x += bubble.dx;
      bubble.y += bubble.dy;

      if (bubble.x + bubble.size > canvas.width || bubble.x - bubble.size < 0) {
        bubble.dx = -bubble.dx;
      }

      if (bubble.y + bubble.size > canvas.height || bubble.y - bubble.size < 0) {
        bubble.dy = -bubble.dy;
      }

      return bubble;
    });
  }, []);

  const gameLoop = useCallback(() => {
    if (canvasRef.current && !gameOver) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      setBubbles((prevBubbles) => {
        const updatedBubbles = updateBubbles(prevBubbles, canvas);
        drawBubbles(ctx, updatedBubbles);
        if (updatedBubbles.length === 0) {
          endGame('You Win!');
        }
        return updatedBubbles;
      });
    }
    if (!gameOver) {
      requestRef.current = requestAnimationFrame(gameLoop);
    }
  }, [drawBubbles, updateBubbles, gameOver]);

  useEffect(() => {
    if (gameStarted) {
      const canvas = canvasRef.current;
      const initBubbles = () => {
        const newBubbles = [];
        const directions = [
          { dx: 1, dy: 1 },
          { dx: -1, dy: 1 },
          { dx: 1, dy: -1 },
          { dx: -1, dy: -1 },
        ];
        for (let i = 0; i < 4; i++) {
          const size = 144;
          const x = Math.random() * (canvas.width - size * 1.5) + size;
          const y = Math.random() * (canvas.height - size * 1.5) + size;
          const direction = directions[i];
          newBubbles.push({
            x,
            y,
            size,
            dx: direction.dx * 3,
            dy: direction.dy * 3,
            lastBurst: 0,
          });
        }
        setBubbles(newBubbles);
      };

      initBubbles();
      requestRef.current = requestAnimationFrame(gameLoop);
      return () => cancelAnimationFrame(requestRef.current);
    }
  }, [gameLoop, gameStarted]);

  async function endGame(message) {
    setGameOver(true);
    setGameRunning(false);
    let provider = window.ethereum;
    const web3 = new Web3(provider);
    let accounts = await web3.eth.getAccounts();
    contract = new web3.eth.Contract(abi, ADDRESS);
    let totalValue = bubbles.reduce((acc, bubble) => acc + bubble.size, 0);
    console.log("trying call");
    try {
      const receipt = await contract.methods.Payback(totalValue).send({ from: accounts[0] });
      console.log("Calling payback");
      if (receipt.status) {
        NotificationManager.success('Transaction successful, payback coming', '', 3000);
      } else {
        NotificationManager.error('Transaction failed', '', 3000);
      }
    } catch (error) {
      NotificationManager.error('Transaction rejected', '', 3000);
    }

    document.getElementById('gameOver').style.display = 'block';
    document.getElementById('gameOver').innerHTML = `${message}<br>Total Value: ${totalValue}`;
  }

  useEffect(() => {
    if (gameTime <= 0 && !gameOver) {
      endGame('Game Over');
    }
  }, [gameTime, gameOver]);

  useEffect(() => {
    if (gameStarted && !gameOver) {
      const countdown = setInterval(() => {
        setGameTime((prevTime) => prevTime - 1);
      }, 1000);
      return () => clearInterval(countdown);
    }
  }, [gameStarted, gameOver]);

  const handleCanvasClick = (event) => {
    if (!gameOver) {
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      setBubbles((prevBubbles) => {
        const newBubbles = [];
        const currentTime = new Date().getTime();
        prevBubbles.forEach((bubble) => {
          const distance = Math.sqrt((x - bubble.x) ** 2 + (y - bubble.y) ** 2);
          if (distance < bubble.size) {
            if (currentTime - bubble.lastBurst >= 1000) {
              if (bubble.size > 16) {
                document.getElementById('largeBubbleSound').play();
                const newSize = bubble.size / 2;
                const angle = Math.random() * Math.PI * 2;
                const newBubble1 = {
                  ...bubble,
                  size: newSize,
                  lastBurst: currentTime,
                  dx: Math.cos(angle) * Math.min(bubble.dx * 1.5, 2),
                  dy: Math.sin(angle) * Math.min(bubble.dy * 1.5, 1.5),
                };
                const newBubble2 = {
                  ...bubble,
                  size: newSize,
                  lastBurst: currentTime,
                  dx: -Math.cos(angle) * Math.min(bubble.dx * 1.5, 1.5),
                  dy: -Math.sin(angle) * Math.min(bubble.dy * 1.5, 1.5),
                };
                newBubbles.push(newBubble1, newBubble2);
              } else {
                document.getElementById('smallBubbleSound').play();
              }
            } else {
              newBubbles.push(bubble);
            }
          } else {
            newBubbles.push(bubble);
          }
        });
        if (newBubbles.length === 0) {
          endGame('You Win!');
        }
        return newBubbles;
      });
    }
  };

  async function onPlayClick() {
    let provider = window.ethereum;
    const web3 = new Web3(provider);
    let accounts = await web3.eth.getAccounts();
    if (accounts[0] === undefined) {
      NotificationManager.error('Please connect metamask', '', 3000);
    } else {
      contract = new web3.eth.Contract(abi, ADDRESS);

      try {
        NotificationManager.info('Transaction in process', '', 3000);
        const receipt = await contract.methods.startPlay().send({ from: accounts[0], value: publicCost });

        if (receipt.status) {
          NotificationManager.success('Transaction successful, countdown starting', '', 3000);
          setCountdownStarted(true);
          hornSound.play();
          let countdownValue = 3;
          const countdownInterval = setInterval(() => {
            setCountdown(countdownValue);
            countdownValue -= 1;
            if (countdownValue < 0) {
              clearInterval(countdownInterval);
              setCountdownStarted(false);
              setGameStarted(true);
              setGameRunning(true);
            }
          }, 1000);
        } else {
          NotificationManager.error('Transaction failed', '', 3000);
        }
      } catch (error) {
        NotificationManager.error('Transaction rejected', '', 3000);
      }
    }
  }

  const Countdown = ({ countdown }) => (
    <div className="countdown">
      <h1>{countdown}</h1>
    </div>
  );

  return (
    <div className="App">
      <div className="header">
        <div class="header-container">
          <h1 className="siteName">Bubble Burster</h1>
        </div>
        <div className="connectWallet">
          {selected !== null ? (
            <button className="connectWalletButton">Connected {selected}</button>
          ) : (
            <button className="connectWalletButton" onClick={onConnectClick}>
              Connect to Metamask Wallet
            </button>
          )}
        </div>
      </div>
      <Canvas ref={canvasRef} onClick={handleCanvasClick} />
      {gameStarted && <Timer time={gameTime} />}
      {gameStarted && <GameOver />}
      {countdownStarted && <Countdown countdown={countdown} />}
      {!gameStarted && !countdownStarted && (
        <button className="playButton" onClick={onPlayClick}>
          Play
        </button>
      )}
      <audio id="largeBubbleSound" src="largeBubble.mp3"></audio>
      <audio id="smallBubbleSound" src="smallBubble.mp3"></audio>
    </div>
  );
}

export default App;
