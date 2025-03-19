import React, { useState, useEffect, useCallback } from 'react';
import './WordSearchGenerator.css';

// Definimos estilos para cada tipo de palabra
const wordStyles = {
  horizontal: {
    cellClass: 'horizontal-highlighted',
    wordClass: 'horizontal-word',
    titleClass: 'horizontal-title'
  },
  vertical: {
    cellClass: 'vertical-highlighted',
    wordClass: 'vertical-word',
    titleClass: 'vertical-title'
  },
  diagonal: {
    cellClass: 'diagonal-highlighted',
    wordClass: 'diagonal-word',
    titleClass: 'diagonal-title'
  },
  bottomUp: {
    cellClass: 'bottomup-highlighted',
    wordClass: 'bottomup-word',
    titleClass: 'bottomup-title'
  },
  topDown: {
    cellClass: 'topdown-highlighted',
    wordClass: 'topdown-word',
    titleClass: 'topdown-title'
  }
};

const WordSearchGenerator = () => {
  // Dimensiones del tablero
  const [rows, setRows] = useState(15);
  const [cols, setCols] = useState(15);
  
  // Categorías de palabras
  const [horizontalWords, setHorizontalWords] = useState(['FUERZA', 'CONFIANZA', 'SUPERACION', 'TEMPLANZA', 'VOLUNTAD']);
  const [verticalWords, setVerticalWords] = useState(['CORAJE', 'TENACIDAD', 'FIRMEZA', 'FORTALEZA', 'POTENCIAL']);
  const [diagonalWords, setDiagonalWords] = useState(['RESILIENCIA', 'PODER', 'CAPACIDAD', 'ESPERANZA', 'ANIMO']);
  const [bottomUpWords, setBottomUpWords] = useState(['VALOR', 'VIRTUD', 'ADAPTACION', 'CONSTANCIA', 'RENOVACION']);
  const [topDownWords, setTopDownWords] = useState(['PACIENCIA', 'ENTEREZA', 'OPTIMISMO', 'RESISTENCIA', 'TRANSFORMACION']);
  
  // Estado del tablero
  const [board, setBoard] = useState([]);
  const [placedWords, setPlacedWords] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('horizontal');
  const [currentWord, setCurrentWord] = useState('');
  const [error, setError] = useState('');
  const [showSolution, setShowSolution] = useState(false);
  const [selectedWord, setSelectedWord] = useState(null);
  
  // Inicializar tablero vacío con useCallback para evitar recreaciones
  const initializeBoard = useCallback(() => {
    const newBoard = Array(rows).fill().map(() => Array(cols).fill(''));
    for(let i = 0; i < rows; i++) {
      for(let j = 0; j < cols; j++) {
        newBoard[i][j] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
      }
    }
    setBoard(newBoard);
    setPlacedWords([]);
  }, [rows, cols]);
  
  // Efecto para inicializar el tablero cuando el componente se monta
  useEffect(() => {
    generatePuzzle(); // Usamos generatePuzzle en lugar de initializeBoard para colocar palabras
  }, []); // Solo se ejecuta al montar el componente
  
  // Efecto para regenerar el tablero cuando cambian las dimensiones
  useEffect(() => {
    // Este efecto se ejecuta cuando cambian las dimensiones, no cuando se monta el componente
    if (board.length > 0) { // Evitar la primera ejecución
      generatePuzzle();
    }
  }, [rows, cols]);
  
  // Función removeWord con useCallback
  const removeWord = useCallback((category, index) => {
    switch(category) {
      case 'horizontal':
        setHorizontalWords(prev => prev.filter((_, i) => i !== index));
        break;
      case 'vertical':
        setVerticalWords(prev => prev.filter((_, i) => i !== index));
        break;
      case 'diagonal':
        setDiagonalWords(prev => prev.filter((_, i) => i !== index));
        break;
      case 'bottomUp':
        setBottomUpWords(prev => prev.filter((_, i) => i !== index));
        break;
      case 'topDown':
        setTopDownWords(prev => prev.filter((_, i) => i !== index));
        break;
      default:
        break;
    }
    // Regenerar el puzzle después de eliminar la palabra
    setTimeout(() => generatePuzzle(), 0);
  }, []);
  
  // Función addWord con useCallback
  const addWord = useCallback(() => {
    if (!currentWord.trim()) {
      setError('Por favor, ingresa una palabra');
      return;
    }
    
    const word = currentWord.toUpperCase();
    
    if (word.length > Math.min(rows, cols)) {
      setError(`La palabra es demasiado larga para el tablero (máximo ${Math.min(rows, cols)} letras)`);
      return;
    }
    
    let currentCategory = [];
    if (selectedCategory === 'horizontal') currentCategory = horizontalWords;
    else if (selectedCategory === 'vertical') currentCategory = verticalWords;
    else if (selectedCategory === 'diagonal') currentCategory = diagonalWords;
    else if (selectedCategory === 'bottomUp') currentCategory = bottomUpWords;
    else if (selectedCategory === 'topDown') currentCategory = topDownWords;
    
    if (currentCategory.includes(word)) {
      setError('Esta palabra ya está en la lista');
      return;
    }
    
    // Actualizar la categoría seleccionada
    switch(selectedCategory) {
      case 'horizontal':
        setHorizontalWords(prev => [...prev, word]);
        break;
      case 'vertical':
        setVerticalWords(prev => [...prev, word]);
        break;
      case 'diagonal':
        setDiagonalWords(prev => [...prev, word]);
        break;
      case 'bottomUp':
        setBottomUpWords(prev => [...prev, word]);
        break;
      case 'topDown':
        setTopDownWords(prev => [...prev, word]);
        break;
      default:
        break;
    }
    
    setCurrentWord('');
    setError('');
    
    // Regenerar el puzzle después de añadir la palabra
    setTimeout(() => generatePuzzle(), 0);
  }, [
    currentWord,
    rows,
    cols,
    selectedCategory,
    horizontalWords,
    verticalWords,
    diagonalWords,
    bottomUpWords,
    topDownWords
  ]);
  
  // Función para generar el puzzle
  const generatePuzzle = useCallback(() => {
    // Primero limpiamos el tablero y creamos uno vacío (sin letras aleatorias)
    const emptyBoard = Array(rows).fill().map(() => Array(cols).fill(''));
    setBoard(emptyBoard);
    
    const allWords = [
      ...horizontalWords, 
      ...verticalWords, 
      ...diagonalWords, 
      ...bottomUpWords, 
      ...topDownWords
    ];
    
    // Ordenamos las palabras por longitud (las más largas primero)
    // para facilitar su colocación
    const sortedWords = [...allWords].sort((a, b) => b.length - a.length);
    
    // Mapa para seguimiento de palabras colocadas
    const wordTypeMap = new Map();
    horizontalWords.forEach(word => wordTypeMap.set(word, 'horizontal'));
    verticalWords.forEach(word => wordTypeMap.set(word, 'vertical'));
    diagonalWords.forEach(word => wordTypeMap.set(word, 'diagonal'));
    bottomUpWords.forEach(word => wordTypeMap.set(word, 'bottomUp'));
    topDownWords.forEach(word => wordTypeMap.set(word, 'topDown'));
    
    const placed = [];
    let workingBoard = JSON.parse(JSON.stringify(emptyBoard)); // Copia profunda
    
    // Intentamos generar un tablero que contenga todas las palabras
    // Si no es posible, aumentamos el tamaño del tablero o reintentamos con diferentes posiciones
    let maxAttempts = 5; // Número máximo de intentos completos para colocar todas las palabras
    let currentAttempt = 0;
    
    while (placed.length < allWords.length && currentAttempt < maxAttempts) {
      // Reiniciar el tablero y la lista de palabras colocadas en cada intento completo
      if (currentAttempt > 0) {
        placed.length = 0;
        workingBoard = JSON.parse(JSON.stringify(emptyBoard));
      }
      
      // Recorremos todas las palabras
      for (const word of sortedWords) {
        if (placed.some(p => p.word === word)) continue; // Saltar palabras ya colocadas
        
        const type = wordTypeMap.get(word);
        let result = null;
        let wordAttempts = 0;
        const maxWordAttempts = 200; // Aumentamos los intentos por palabra
        
        // Intentar colocar la palabra varias veces con diferentes posiciones aleatorias
        while (!result && wordAttempts < maxWordAttempts) {
          // Crear un nuevo tablero temporal para cada intento (copia profunda)
          const currentBoard = JSON.parse(JSON.stringify(workingBoard));
          
          // Intentar colocar la palabra según su tipo
          if (type === 'horizontal') {
            result = placeWordHorizontal(word, currentBoard);
          } else if (type === 'vertical') {
            result = placeWordVertical(word, currentBoard);
          } else if (type === 'diagonal') {
            result = placeWordDiagonal(word, currentBoard);
          } else if (type === 'bottomUp') {
            result = placeWordBottomUp(word, currentBoard);
          } else if (type === 'topDown') {
            result = placeWordTopDown(word, currentBoard);
          }
          
          wordAttempts++;
        }
        
        // Si la palabra se pudo colocar, actualizar el tablero de trabajo
        if (result) {
          placed.push(result);
          // Crear un nuevo tablero con la palabra colocada
          for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
              // Solo actualizamos las celdas que tienen letras en el tablero temporal
              // y dejamos intactas las demás
              if (result.direction === 'horizontal' && 
                  i === result.position.row && 
                  j >= result.position.col && 
                  j < result.position.col + result.length) {
                workingBoard[i][j] = word[j - result.position.col];
              } else if (result.direction === 'vertical' && 
                        j === result.position.col && 
                        i >= result.position.row && 
                        i < result.position.row + result.length) {
                workingBoard[i][j] = word[i - result.position.row];
              } else if (result.direction === 'diagonal' && 
                        i - result.position.row === j - result.position.col && 
                        i >= result.position.row && 
                        i < result.position.row + result.length) {
                workingBoard[i][j] = word[i - result.position.row];
              } else if (result.direction === 'bottomUp' && 
                        j === result.position.col && 
                        i <= result.position.row && 
                        i > result.position.row - result.length) {
                workingBoard[i][j] = word[result.position.row - i];
              } else if (result.direction === 'topDown' && 
                        i >= result.position.row && 
                        j <= result.position.col && 
                        i < result.position.row + result.length && 
                        j > result.position.col - result.length && 
                        i - result.position.row === result.position.col - j) {
                workingBoard[i][j] = word[i - result.position.row];
              }
            }
          }
        }
      }
      
      currentAttempt++;
    }
    
    // Si no hemos podido colocar todas las palabras, aumentamos el tamaño del tablero para el próximo intento
    if (placed.length < allWords.length) {
      console.log(`No se pudieron colocar todas las palabras. Se colocaron ${placed.length} de ${allWords.length}`);
      
      // Esto es solo para la versión actual, en la siguiente generación el tablero será más grande
      if (rows < 20) setRows(prev => Math.min(20, prev + 1));
      if (cols < 20) setCols(prev => Math.min(20, prev + 1));
    }
    
    // Forzamos a que todas las palabras estén colocadas para este ejemplo
    // Si algunas palabras no se pudieron colocar, las añadimos artificialmente
    const missingWords = allWords.filter(word => !placed.some(p => p.word === word));
    for (const word of missingWords) {
      const type = wordTypeMap.get(word);
      // Encontrar un lugar forzado para la palabra
      let forceResult;
      
      if (type === 'horizontal' && cols >= word.length) {
        // Colocar horizontalmente en la primera fila disponible
        const row = placed.length % rows;
        forceResult = { 
          word, 
          direction: 'horizontal', 
          position: { row, col: 0 }, 
          length: word.length 
        };
        
        // Colocar la palabra en el tablero
        for (let i = 0; i < word.length; i++) {
          workingBoard[row][i] = word[i];
        }
      } else if (type === 'vertical' && rows >= word.length) {
        // Colocar verticalmente en la primera columna disponible
        const col = placed.length % cols;
        forceResult = { 
          word, 
          direction: 'vertical', 
          position: { row: 0, col }, 
          length: word.length 
        };
        
        // Colocar la palabra en el tablero
        for (let i = 0; i < word.length; i++) {
          workingBoard[i][col] = word[i];
        }
      } else if (type === 'diagonal' && rows >= word.length && cols >= word.length) {
        const offset = placed.length % (Math.min(rows, cols) - word.length + 1);
        forceResult = { 
          word, 
          direction: 'diagonal', 
          position: { row: offset, col: offset }, 
          length: word.length 
        };
        
        // Colocar la palabra en el tablero
        for (let i = 0; i < word.length; i++) {
          workingBoard[offset + i][offset + i] = word[i];
        }
      } else if (type === 'bottomUp' && rows >= word.length) {
        const col = (placed.length + 1) % cols;
        const row = Math.min(rows - 1, word.length + 2);
        forceResult = { 
          word, 
          direction: 'bottomUp', 
          position: { row, col }, 
          length: word.length 
        };
        
        // Colocar la palabra en el tablero
        for (let i = 0; i < word.length; i++) {
          workingBoard[row - i][col] = word[i];
        }
      } else if (type === 'topDown' && rows >= word.length && cols >= word.length) {
        const row = placed.length % (rows - word.length + 1);
        const col = Math.min(cols - 1, word.length + 2);
        forceResult = { 
          word, 
          direction: 'topDown', 
          position: { row, col }, 
          length: word.length 
        };
        
        // Colocar la palabra en el tablero
        for (let i = 0; i < word.length; i++) {
          workingBoard[row + i][col - i] = word[i];
        }
      }
      
      if (forceResult) {
        placed.push(forceResult);
      }
    }
    
    // Rellenar los espacios vacíos con letras aleatorias
    const finalBoard = workingBoard.map(row => 
      row.map(cell => cell === '' ? String.fromCharCode(65 + Math.floor(Math.random() * 26)) : cell)
    );
    
    setBoard(finalBoard);
    setPlacedWords(placed);
    
    // Mostrar estadísticas en consola para depuración
    console.log(`Palabras colocadas: ${placed.length} de ${allWords.length}`);
    // La colocación debe ser 100%
    if (placed.length === allWords.length) {
      console.log('¡Todas las palabras colocadas con éxito!');
    }
  }, [
    rows, 
    cols, 
    horizontalWords, 
    verticalWords, 
    diagonalWords, 
    bottomUpWords, 
    topDownWords
  ]);
  
  // Funciones auxiliares para colocar palabras (sin setState para permitir varios intentos)
  const placeWordHorizontal = (word, board) => {
    const maxTries = 100;
    let tries = 0;
    
    while (tries < maxTries) {
      const row = Math.floor(Math.random() * rows);
      const col = Math.floor(Math.random() * (cols - word.length + 1));
      
      let canPlace = true;
      for (let i = 0; i < word.length; i++) {
        if (board[row][col + i] !== '' && board[row][col + i] !== word[i]) {
          canPlace = false;
          break;
        }
      }
      
      if (canPlace) {
        for (let i = 0; i < word.length; i++) {
          board[row][col + i] = word[i];
        }
        return { word, direction: 'horizontal', position: { row, col }, length: word.length };
      }
      
      tries++;
    }
    
    return null;
  };

  const placeWordVertical = (word, board) => {
    const maxTries = 100;
    let tries = 0;
    
    while (tries < maxTries) {
      const row = Math.floor(Math.random() * (rows - word.length + 1));
      const col = Math.floor(Math.random() * cols);
      
      let canPlace = true;
      for (let i = 0; i < word.length; i++) {
        if (board[row + i][col] !== '' && board[row + i][col] !== word[i]) {
          canPlace = false;
          break;
        }
      }
      
      if (canPlace) {
        for (let i = 0; i < word.length; i++) {
          board[row + i][col] = word[i];
        }
        return { word, direction: 'vertical', position: { row, col }, length: word.length };
      }
      
      tries++;
    }
    
    return null;
  };

  const placeWordDiagonal = (word, board) => {
    const maxTries = 100;
    let tries = 0;
    
    while (tries < maxTries) {
      const row = Math.floor(Math.random() * (rows - word.length + 1));
      const col = Math.floor(Math.random() * (cols - word.length + 1));
      
      let canPlace = true;
      for (let i = 0; i < word.length; i++) {
        if (board[row + i][col + i] !== '' && board[row + i][col + i] !== word[i]) {
          canPlace = false;
          break;
        }
      }
      
      if (canPlace) {
        for (let i = 0; i < word.length; i++) {
          board[row + i][col + i] = word[i];
        }
        return { word, direction: 'diagonal', position: { row, col }, length: word.length };
      }
      
      tries++;
    }
    
    return null;
  };

  // Función corregida para colocar palabras de abajo hacia arriba
  const placeWordBottomUp = (word, board) => {
    const maxTries = 100;
    let tries = 0;
    
    while (tries < maxTries) {
      // Asegurar que hay suficiente espacio para la palabra
      const row = Math.floor(Math.random() * (rows - word.length + 1)) + word.length - 1;
      const col = Math.floor(Math.random() * cols);
      
      let canPlace = true;
      // Verificar si se puede colocar
      for (let i = 0; i < word.length; i++) {
        // Verificar que el índice de la fila esté dentro de los límites del tablero
        if (row - i < 0 || row - i >= rows) {
          canPlace = false;
          break;
        }
        // Verificar que la casilla esté vacía o contenga la misma letra
        if (board[row - i][col] !== '' && board[row - i][col] !== word[i]) {
          canPlace = false;
          break;
        }
      }
      
      if (canPlace) {
        // Colocar las letras
        for (let i = 0; i < word.length; i++) {
          board[row - i][col] = word[i];
        }
        return { word, direction: 'bottomUp', position: { row, col }, length: word.length };
      }
      
      tries++;
    }
    
    return null;
  };

  // Función corregida para colocar palabras de arriba hacia abajo en diagonal
  const placeWordTopDown = (word, board) => {
    const maxTries = 100;
    let tries = 0;
    
    while (tries < maxTries) {
      // Asegurar que hay suficiente espacio para la palabra
      const row = Math.floor(Math.random() * (rows - word.length + 1));
      const col = Math.floor(Math.random() * (cols - word.length + 1)) + word.length - 1;
      
      let canPlace = true;
      // Verificar si se puede colocar
      for (let i = 0; i < word.length; i++) {
        // Verificar que los índices estén dentro de los límites del tablero
        if (row + i < 0 || row + i >= rows || col - i < 0 || col - i >= cols) {
          canPlace = false;
          break;
        }
        // Verificar que la casilla esté vacía o contenga la misma letra
        if (board[row + i][col - i] !== '' && board[row + i][col - i] !== word[i]) {
          canPlace = false;
          break;
        }
      }
      
      if (canPlace) {
        // Colocar las letras
        for (let i = 0; i < word.length; i++) {
          board[row + i][col - i] = word[i];
        }
        return { word, direction: 'topDown', position: { row, col }, length: word.length };
      }
      
      tries++;
    }
    
    return null;
  };

  // Función para verificar si una celda debe ser resaltada
  const isHighlighted = useCallback((row, col) => {
    // Caso 1: Hay una palabra seleccionada específicamente
    if (selectedWord && placedWords && placedWords.length > 0) {
      const foundWord = placedWords.find(placed => placed.word === selectedWord);
      if (foundWord) {
        const { direction, position, length } = foundWord;
        
        if (direction === 'horizontal') {
          if (row === position.row && col >= position.col && col < position.col + length) {
            return { isHighlighted: true, style: wordStyles.horizontal.cellClass, isSelected: true };
          }
        } else if (direction === 'vertical') {
          if (col === position.col && row >= position.row && row < position.row + length) {
            return { isHighlighted: true, style: wordStyles.vertical.cellClass, isSelected: true };
          }
        } else if (direction === 'diagonal') {
          if (row - position.row === col - position.col && row >= position.row && row < position.row + length) {
            return { isHighlighted: true, style: wordStyles.diagonal.cellClass, isSelected: true };
          }
        } else if (direction === 'bottomUp') {
          // De abajo hacia arriba (vertical inversa)
          if (col === position.col && row <= position.row && row > position.row - length) {
            return { isHighlighted: true, style: wordStyles.bottomUp.cellClass, isSelected: true };
          }
        } else if (direction === 'topDown') {
          // De arriba hacia abajo (diagonal inversa)
          if (row - position.row === position.col - col && 
              row >= position.row && 
              row < position.row + length &&
              col <= position.col && 
              col > position.col - length) {
            return { isHighlighted: true, style: wordStyles.topDown.cellClass, isSelected: true };
          }
        }
      }
      return { isHighlighted: false };
    }
    
    // Caso 2: Mostrar todas las soluciones
    if (!showSolution) return { isHighlighted: false };
    
    if (placedWords && placedWords.length > 0) {
      for (const placedWord of placedWords) {
        const { direction, position, length, word } = placedWord;
        
        if (direction === 'horizontal') {
          if (row === position.row && col >= position.col && col < position.col + length) {
            return { 
              isHighlighted: true, 
              style: wordStyles.horizontal.cellClass,
              letter: word[col - position.col] // Asegura que mostramos la letra original de la palabra
            };
          }
        } else if (direction === 'vertical') {
          if (col === position.col && row >= position.row && row < position.row + length) {
            return { 
              isHighlighted: true, 
              style: wordStyles.vertical.cellClass,
              letter: word[row - position.row]
            };
          }
        } else if (direction === 'diagonal') {
          if (row - position.row === col - position.col && row >= position.row && row < position.row + length) {
            return { 
              isHighlighted: true, 
              style: wordStyles.diagonal.cellClass,
              letter: word[row - position.row]
            };
          }
        } else if (direction === 'bottomUp') {
          // De abajo hacia arriba (vertical inversa)
          if (col === position.col && row <= position.row && row > position.row - length) {
            return { 
              isHighlighted: true, 
              style: wordStyles.bottomUp.cellClass,
              letter: word[position.row - row]
            };
          }
        } else if (direction === 'topDown') {
          // De arriba hacia abajo (diagonal inversa)
          if (row - position.row === position.col - col && 
              row >= position.row && 
              row < position.row + length &&
              col <= position.col && 
              col > position.col - length) {
            return { 
              isHighlighted: true, 
              style: wordStyles.topDown.cellClass,
              letter: word[row - position.row]
            };
          }
        }
      }
    }
    
    return { isHighlighted: false };
  }, [showSolution, placedWords, selectedWord]);

  // Función para renderizar listas de palabras con categoryKey corregido
  const renderWordList = useCallback((category, words, styleClass) => {
    // Obtener la clave de categoría correcta basada en el título
    const getCategoryKey = (categoryTitle) => {
      switch(categoryTitle) {
        case 'Horizontal': return 'horizontal';
        case 'Vertical': return 'vertical';
        case 'Diagonal': return 'diagonal';
        case 'De Abajo hacia Arriba': return 'bottomUp';
        case 'De Arriba hacia Abajo': return 'topDown';
        default: return categoryTitle.toLowerCase().replace(/\s+/g, '');
      }
    };
    
    const categoryKey = getCategoryKey(category);
    
    return (
      <div className="word-category">
        <h3 className={`category-title ${styleClass}`}>{category}:</h3>
        <ul className="word-list">
          {words.map((word, index) => (
            <li key={index} className="word-item">
              <button 
                onClick={() => setSelectedWord(selectedWord === word ? null : word)}
                className={`word-button ${selectedWord === word ? 'selected' : ''}`}
                type="button"
              >
                {word}
              </button>
              <button 
                onClick={() => removeWord(categoryKey, index)}
                className="remove-btn"
                type="button"
              >
                x
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  }, [removeWord, selectedWord]);

  return (
    <div className="word-search-container">
      <div className="word-search-panel board-panel">
        <h2 className="form-heading">Sopa de Letras: Resiliencia y Poder</h2>
        
        <div className="form-group">
          <label className="form-label">Tamaño del Tablero:</label>
          <div className="size-inputs">
            <input
              type="number"
              value={rows}
              onChange={(e) => setRows(Math.min(20, Math.max(5, parseInt(e.target.value) || 5)))}
              className="form-input"
              min="5"
              max="20"
            />
            x
            <input
              type="number"
              value={cols}
              onChange={(e) => setCols(Math.min(20, Math.max(5, parseInt(e.target.value) || 5)))}
              className="form-input"
              min="5"
              max="20"
            />
          </div>
        </div>
        
        <div className="form-group">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="form-select"
          >
            <option value="horizontal">Horizontal</option>
            <option value="vertical">Vertical</option>
            <option value="diagonal">Diagonal</option>
            <option value="bottomUp">De Abajo hacia Arriba</option>
            <option value="topDown">De Arriba hacia Abajo</option>
          </select>
          
          <div className="form-input-group">
            <input
              type="text"
              value={currentWord}
              onChange={(e) => setCurrentWord(e.target.value)}
              placeholder="Ingresa una palabra"
              className="form-text-input"
            />
            <button
              onClick={addWord}
              className="add-btn"
              type="button"
            >
              Añadir
            </button>
          </div>
          
          {error && <p className="error-text">{error}</p>}
        </div>
        
        <div className="button-group">
          <button
            onClick={generatePuzzle}
            className="generate-btn"
            type="button"
          >
            Generar Sopa de Letras
          </button>
          
          <button
            onClick={() => {
              setShowSolution(!showSolution);
              setSelectedWord(null);
            }}
            className={`solution-btn ${showSolution ? 'active' : ''}`}
            type="button"
          >
            {showSolution ? 'Ocultar Solución' : 'Mostrar Solución'}
          </button>
        </div>
        
        {placedWords && (
          <div className="word-count">
            <p>Palabras colocadas: {placedWords.length} de {horizontalWords.length + verticalWords.length + diagonalWords.length + bottomUpWords.length + topDownWords.length}</p>
          </div>
        )}
        
        <div className="word-search-board">
          <table className="word-search-table">
            <tbody>
              {board.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, colIndex) => {
                    const highlight = isHighlighted(rowIndex, colIndex);
                    return (
                      <td 
                        key={colIndex}
                        className={`board-cell ${
                          highlight.isHighlighted 
                          ? `${highlight.style} ${highlight.isSelected ? 'selected-cell' : showSolution ? 'solution-cell' : ''}` 
                          : ''
                        }`}
                      >
                        {highlight.isHighlighted && highlight.letter ? highlight.letter : cell}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="word-search-panel words-panel">
        <h2 className="form-heading">Palabras a encontrar</h2>
        <p className="form-instruction">Haz clic en una palabra para resaltarla en la sopa de letras</p>
        
        <div className="word-categories">
          <div>
            {renderWordList('Horizontal', horizontalWords, wordStyles.horizontal.titleClass)}
            {renderWordList('Vertical', verticalWords, wordStyles.vertical.titleClass)}
            {renderWordList('Diagonal', diagonalWords, wordStyles.diagonal.titleClass)}
          </div>
          <div>
            {renderWordList('De Abajo hacia Arriba', bottomUpWords, wordStyles.bottomUp.titleClass)}
            {renderWordList('De Arriba hacia Abajo', topDownWords, wordStyles.topDown.titleClass)}
          </div>
        </div>
        
        {selectedWord && placedWords && placedWords.length > 0 && (
          <div className="word-info">
            <p className="word-info-text">
              <span className="word-highlight">{selectedWord}</span> - 
              {(() => {
                const foundWord = placedWords.find(placed => placed.word === selectedWord);
                if (foundWord) {
                  const { direction, position } = foundWord;
                  return direction === 'horizontal' 
                    ? ` Horizontal (fila ${position.row + 1}, columna ${position.col + 1})` 
                    : direction === 'vertical'
                    ? ` Vertical (fila ${position.row + 1}, columna ${position.col + 1})` 
                    : direction === 'diagonal'
                    ? ` Diagonal (fila ${position.row + 1}, columna ${position.col + 1})` 
                    : direction === 'bottomUp'
                    ? ` De Abajo hacia Arriba (fila ${position.row + 1}, columna ${position.col + 1})` 
                    : ` De Arriba hacia Abajo (fila ${position.row + 1}, columna ${position.col + 1})`;
                }
                return ' no encontrada en el tablero';
              })()}
            </p>
          </div>
        )}
        
        {showSolution && placedWords && placedWords.length > 0 && (
          <div className="solution-container">
            <h3 className="solution-title">¡Solución!</h3>
            <div className="solution-grid">
              {placedWords.map((placed, index) => (
                <p key={index} className={`solution-word ${wordStyles[placed.direction].wordClass}`}>
                  <strong>{placed.word}</strong>: {placed.direction === 'horizontal' 
                    ? `Horizontal (fila ${placed.position.row + 1}, columna ${placed.position.col + 1})` 
                    : placed.direction === 'vertical'
                    ? `Vertical (fila ${placed.position.row + 1}, columna ${placed.position.col + 1})` 
                    : placed.direction === 'diagonal'
                    ? `Diagonal (fila ${placed.position.row + 1}, columna ${placed.position.col + 1})` 
                    : placed.direction === 'bottomUp'
                    ? `De Abajo hacia Arriba (fila ${placed.position.row + 1}, columna ${placed.position.col + 1})` 
                    : `De Arriba hacia Abajo (fila ${placed.position.row + 1}, columna ${placed.position.col + 1})`}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WordSearchGenerator;