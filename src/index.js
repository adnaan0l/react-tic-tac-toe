import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

  function Square(props) {
    return (
      <button 
        className="square"
        onClick={props.onClick}
      >
        {props.value}
      </button>
    );
  }
  
  class Board extends React.Component {
    renderSquare(i) {
      return (
        <Square 
          value={this.props.squares[i]} 
          onClick={() => this.props.onClick(i)}
        />
      );
    }
  
    renderRow(row) {
      const squares = [];
      const offset = row * 3; // this makes sure first row is 0,1,2, second row is 3,4,5, etc.
      for (let s = 0; s < 3; s++) {
        squares.push(
          this.renderSquare(offset + s)
          );
      }
      return (
        <div className="board-row">
          {squares}
        </div>
      )
    }

    render() {
      const rows = [];
      for (let r=0; r < 3; r++) {
        rows.push(
          this.renderRow(r)
        );
      }  
      return (   
          <div>{rows}</div>
      );
    }
  }
  
  class Game extends React.Component {
    constructor(props){
      super(props);
      this.state = {
        history: [{
          squares: Array(9).fill(null),
        }],
        stepNumber: 0,
        xIsNext: true,
        currentStep: 0,
      };
    }


    handleClick(i) {
      const history = this.state.history.slice(0, this.state.stepNumber + 1);
      const current = history[history.length - 1];
      const squares = current.squares.slice();
      const curIndex = getIndex(i)

      if (calculateWinner(squares) || squares[i]) {
        return;
      }

      squares[i] = this.state.xIsNext ? 'X' : 'O';

      this.setState({
        history: history.concat([{
          squares:squares,
          curIndex:curIndex
        }]),
        stepNumber: history.length,
        xIsNext: !this.state.xIsNext,
      });
    }

    jumpTo(step) {
      this.setState({
        stepNumber: step,
        xIsNext: (step % 2) === 0,
      });
    }

    isCurrent(move) {
      return this.state.stepNumber === move;
    }

    render() {
      const history = this.state.history;
      const current = history[this.state.stepNumber];
      const winner = calculateWinner(current.squares);

      const moves = history.map((step, move) => {
        const location = move ? 
          'Location => ' + history[move].curIndex :
          '';
        const desc = move ?
          'Go to move #' + move :
          'Go to game start';
        return (
          <li 
            style={{'fontWeight': this.isCurrent(move) ? 'bold' : 'normal'}} 
            key={move}>
              <button 
                style={{
                  'fontSize': '16px',
                  'borderRadius': '4px',
                  'backgroundColor': this.isCurrent(move) ? '#555555' : '#e7e7e7',
                  'color' : this.isCurrent(move) ? 'white' : 'black',
                  'borderWidth': this.isCurrent(move) ? 'medium' : 'thin'
                }}
                onClick={() => this.jumpTo(move)}
              >
              {desc}
            </button>
            <p>{location}</p>
          </li>
        );
      });

      let status;
      if (winner) {
        status = 'Winner: ' + winner;
      }
      else {
        status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
      }

      return (
        <div className="game">
            <h1>Tic-Tac-Toe</h1>
          <div className="game-board">
            <Board 
              squares={current.squares}
              onClick={i => this.handleClick(i)}
            />
          </div>
          <div className="game-info">
            <div>{status}</div>
            <ol>{moves}</ol>
          </div>
        </div>
      );
    }
  }
  
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );
  
  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }
  
  function getIndex(i) {
    if (i < 3) {
      return "(0, " + i + ")";
      }
    else if (i < 6) {
      return "(1, " + (i-3) + ")";
    }
    else if (i < 9) {
      return "(2, " + (i-6) + ")"
    }
  }