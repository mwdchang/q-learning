class QLearnMaze {
  constructor() {
    this.world = [
      1, 2, 1, 1, 1, 2, 1, 1,
      1, 2, 1, 2, 1, 1, 1, 1,
      1, 0, 1, 1, 1, 2, 1, 1,
      1, 1, 1, 1 ,2, 2, 1, 1,
      2, 2, 1, 2, 1, 1, 1, 1,
      1, 1, 1, 2, 1, 2, 2, 1,
      2, 1, 2, 2, 1, 2, 9, 1,
      2, 1, 1, 1, 1, 1, 1, 2
    ];

    this.Q = this.world.map( d => { 
      return [0, 0, 0, 0]; 
    });
    this.h = 8;
    this.w = 8;
    this.pos = this.world.indexOf(0);
    console.log("pos", this.pos);
  }


  toPath(path) {
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
    let counter = 1;
    r.push(this.pos);

    while(true) {
      let actions = _.cloneDeep(this.Q[this.pos]);
      let valids = this.possibleMoves();
      actions = actions.map( (d, i) => {
        if (valids.indexOf(i) < 0) {
          return -1;
        }
        return d + Math.random()*0.00001;
      });

      // Move to next state
      let greedy = _.maxBy(actions.map((d, i) => { return {idx: i, val: d}; }), d => d.val);
      this.move(greedy.idx);
      r.push(this.pos);
      counter ++;

      if (this.world[this.pos] === 9 || this.world[this.pos] === 2 || counter >= 30) {
        return r;
      }
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

    let Q = this.Q;
    this.reset();
    for (let idx = 0; idx < 80; idx++) {
      let cPos = this.pos;

      // Find the most likely action (plus a little jitter) at position
      let actions = _.cloneDeep(Q[this.pos]);
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
      } else if (this.world[this.pos] === 2) {
        reward = -0.01;
      }
 
      // Q[s,a] = Q[s,a] + lr*(r + y*np.max(Q[s1,:]) - Q[s,a])
      Q[cPos][greedy.idx] += rate * (reward + 0.95 * _.max(Q[this.pos]) - Q[cPos][greedy.idx]); 
      if (this.world[this.pos] === 2) {
        return;
      }
    }
  }

  resetQTable() {
    this.Q = this.world.map( d => { 
      return [0, 0, 0, 0]; 
    });
    this.reset();
  }

  reset() {
    // this.pos = 0;
    this.pos = this.world.indexOf(0);
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



