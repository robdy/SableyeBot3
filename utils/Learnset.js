'use strict';

var learnsetCache = {};

class Learnset {

  constructor (pokemon, dex) {
    if (typeof pokemon === 'string') {
      pokemon = dex.getTemplate(pokemon);
    }
    
    this.pokemon = pokemon.speciesid;
    this.learnset = [];
    this.gen = dex.gen;
    
    if (learnsetCache[this.gen] && learnsetCache[this.gen][this.pokemon]) {
      this.learnset = learnsetCache[this.gen][this.pokemon];
      return;
    }
    
    let alreadyChecked = {};
    let srcMon = 'direct';
    
    do {
      alreadyChecked[pokemon.speciesid] = true;
      
      //Does not have its own learnset (e.g. Mega form); take from base
      if (!pokemon.learnset) {
        if (pokemon.baseSpecies !== pokemon.species) {
          pokemon = dex.getTemplate(pokemon.baseSpecies);
          srcMon = 'base species';
          continue;
        }
        break;
      }
      
      let moves = Object.keys(pokemon.learnset);
      for (let i = 0; i < moves.length; i++){
        let move = moves[i];
        for (let j = 0; j < pokemon.learnset[move].length; j++){
          let moveEntry = pokemon.learnset[move][j];
          let gen = moveEntry.charAt(0);
          let method = moveEntry.charAt(1);
          let lvl = -1;
          if (method === 'S' || method === 'L') {
            lvl = moveEntry.slice(2);
          }
            
          let moveObj = {
            'name': move, 
            'gen': parseInt(gen), 
            'method': method,
            'source': srcMon,
            'level': lvl
          };

          this.learnset.push(moveObj);
        }
      }
      
      if (pokemon.species === 'Lycanroc-Dusk') {
        pokemon = dex.getTemplate('Rockruff-Dusk');
      } else if (pokemon.prevo) {
        pokemon = dex.getTemplate(pokemon.prevo);
        srcMon = 'prevo';
        if (pokemon.gen > this.gen) {
          pokemon = null;
        }
      } else if (pokemon.baseSpecies && pokemon.baseSpecies === 'Rotom') {
        pokemon = dex.getTemplate(pokemon.baseSpecies);
        srcMon = 'base species';
      } else {
        pokemon = null;
      }
    } while (pokemon && pokemon.species && !alreadyChecked[pokemon.speciesid]);
    
    if (!learnsetCache[this.gen]) {
      learnsetCache[this.gen] = {};
    }
    learnsetCache[this.gen][this.pokemon] = this.learnset;
  }
  
  findMove(moveid, gen = null) {
    let moves = [];
    for (let i = 0; i < this.learnset.length; i++){
      if (this.learnset[i].name === moveid) {
        if (!gen || this.learnset[i].gen === gen) {
          moves.push(this.learnset[i]);
        }
      }
    }
    return moves;
  }
  
  canHaveMove(moveid, gen = null) {
    for (let i = 0; i < this.learnset.length; i++){
      if (this.learnset[i].name === moveid) {
        if (!gen || this.learnset[i].gen <= gen) {
          return true;
        }
      }
    }
    return false;
  }
  
  movesArray() {
    let arr = [];
    for (let i = 0; i < this.learnset.length; i++){
      arr.push(this.learnset[i].name);
    }
    return arr;
  }
  
}

module.exports = Learnset;
