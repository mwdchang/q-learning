class QLearnMaze {
  constructor() {
    this.world = [
      0, 1, 1, 1,
      1, 2, 1, 2,
      1, 1, 1, 2,
      2, 1, 1, 9
    ];

    this.Q = this.world.map( d => { 
      return [0, 0, 0, 0]; 
    });
    this.h = 4;
    this.w = 4;
    this.pos = 0;
  }


  pretty(path) {
    console.log('!!', path);
    return path.map( d => {
      return {
        y: Math.floor(+d / this.h),
        x: +d % this.w
      };
    });
  }


  simulate() {
    this.reset();
    let r = [];
    let counter = 0;

    while(true) {
      let actions = _.cloneDeep(this.Q[this.pos]);
      let valids = this.possibleMoves();
      actions = actions.map( (d, i) => {
        if (valids.indexOf(i) < 0) {
          return -1;
        }
        return d;
      });

      // Move to next state
      let greedy = _.maxBy(actions.map((d, i) => { return {idx: i, val: d}; }), d => d.val);
      this.move(greedy.idx);
      r.push(this.pos);

      if (this.world[this.pos] === 9 || this.world[this.pos] === 2 || counter > 20) {
        return r;
      }
      counter ++;
    }
    return r;
  }



  train() {
    for (let eIdx = 0; eIdx < 400; eIdx ++) {
      this.epoch(eIdx);
    }
  }


  epoch(eIdx) {
    console.log('epoch ' + eIdx);
    this.reset();
    for (let idx = 0; idx < 80; idx++) {
      let cPos = this.pos;

      let actions = _.cloneDeep(this.Q[this.pos]);
      let valids = this.possibleMoves();
      actions = actions.map( (d, i) => {
        if (valids.indexOf(i) < 0) {
          return -1;
        }
        return d + Math.random()/(eIdx+1);
      });

      // Move to next state
      let greedy = _.maxBy(actions.map((d, i) => { return {idx: i, val: d}; }), d => d.val);
      this.move(greedy.idx);

      let reward = 0;
      let rate = 0.8;
      if (this.world[this.pos] === 9) {
        reward = 1;
      }

      console.log('!',  cPos, this.pos, this.Q[cPos][greedy.idx], this.Q[this.pos][greedy.idx]);
      

      // this.Q[cPos][greedy.idx] += rate * (reward + 0.95 * this.Q[this.pos][greedy.idx] - this.Q[cPos][greedy.idx]); 
      this.Q[cPos][greedy.idx] += rate * (reward + 0.95 * _.max(this.Q[this.pos]) - this.Q[cPos][greedy.idx]); 
      // console.log(this.Q[cPos]);
      // console.log(this.pos, this.world[this.pos], actions);
      if (this.world[this.pos] === 2) {
        return;
      }
      /*
      if (reward === 1 || this.world[this.pos] === 2) {
        return;
      }
      */
    }
  }

  reset() {
    this.pos = 0;
  }

  /**
   * 0 - up
   * 1 - down
   * 2 - left 
   * 3 - right
   */
  move(d) {
    if (d === 0) this.pos -= this.w;
    if (d === 1) this.pos += this.w;
    if (d === 2) this.pos --;
    if (d === 3) this.pos ++;
  }

  possibleMoves() {
    let r = [];
    if (this.pos % this.w < (this.w -1)) {
      r.push(3);
    }
    if (this.pos % this.w > 0) {
      r.push(2);
    }
    if (this.pos > this.w) {
      r.push(0);
    }
    if (this.pos < (this.w - 1)*this.h) {
      r.push(1);
    }
    return r;
  }


}



