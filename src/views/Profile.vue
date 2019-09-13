<template>
  <b-container>
    <div class="profile">
      <div id="adminProfile" v-if="isAdmin">
        <b-row>
          <b-col>
            <b-button variant="success" @click="startRound">Start Round</b-button>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <div id="previousRounds">
              <div v-for="round in rounds">
                <b-card class="mb-2" style="max-width: 50rem;">
                  <b-card-text style="text-align:left">
                    <b-row>
                      <b-col cols="3">
                        <span> Round: </span>
                      </b-col>
                      <b-col cols="9">
                        <b-badge pill variant="primary">{{ round.id }}</b-badge>
                      </b-col>
                    </b-row>
                    <b-row>
                      <b-col cols="5">
                        <span> Winning Combination: </span>
                      </b-col>
                      <b-col cols="7">
                        <b-badge pill variant="warning" v-for="number in round.winningCombination" class="roundNumbers">{{ number }}</b-badge>
                      </b-col>
                    </b-row>
                  </b-card-text>
                </b-card>
              </div>
            </div>
          </b-col>
        </b-row>
      </div>
      <div id="userProfile" v-if="!isAdmin">
        <div id="createTicket">
          <b-row>
            <b-col>
              <b-button variant="success" v-if="!isCreateTicket" @click="createTicket">Create Ticket</b-button>
              <p v-if="placedTicket">{{ message }}</p>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <div v-if="isCreateTicket">
                <b-form @submit.prevent="placeTicket" @reset="onReset">
                  <b-form-group id="input-group-3" label="Select 7 Numbers:" label-for="input-3">
                    <b-form-select multiple
                      id="input-3"
                      v-model="numbers"
                      :options="possibleNumbers"
                      required
                    ></b-form-select>
                  </b-form-group>

                  <b-alert show variant="warning" >Your Combination: {{ this.numbers.join(',') }}</b-alert>
                  <b-row id="buttons">
                    <b-col>
                      <b-button type="button" class="buttons" variant="warning" @click="createTicket">Back</b-button>
                      <b-button type="reset" class="buttons" variant="danger">Reset</b-button>
                    </b-col>
                    <b-col></b-col>
                    <b-col>
                      <b-button type="submit" class="buttons" variant="success">Submit</b-button>
                    </b-col>
                  </b-row>
                </b-form>
              </div>
            </b-col>
          </b-row>
        </div>
        <div>
          <b-row>
            <b-col>
              <b-alert show variant="primary">Your Tickets:</b-alert>
            </b-col>
          </b-row>
              <b-card-group deck >
                <b-card bg-variant="secondary" text-variant="white" class="text-center" v-for="ticket in tickets" style="min-height: 17rem;">
                  <b-card-text>
                    <b-row>
                      <span>Ticket Number: {{ ticket.id }}</span>
                    </b-row>
                    <b-row>
                      <span> Combination:</span>
                    </b-row>
                    <b-row style="min-width: 10rem;min-height: 6em;">
                      <b-badge pill variant="primary" v-for="number in ticket.combination" class="numbers" style="height: 2.2rem;">{{ number }}</b-badge>
                    </b-row>
                    <b-row>
                      <span>Award: {{ ticket.awardBalance }}</span>
                    </b-row>
                    <b-row>
                      <span>Status: <span v-bind:class="{ pending:ticket.pending, lose:ticket.lose, win:ticket.win }">{{ ticket.status }}</span></span>
                    </b-row>
                  </b-card-text>
                </b-card>
              </b-card-group>
        </div>
      </div>
    </div>
  </b-container>
</template>

<script>
export default {
  name: "profile",
  data() {
    return {
      tickets: [],
      rounds: [],
      isCreateTicket: false,
      placedTicket: false,
      message: "",
      numbers: [],
      possibleNumbers: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37]
    };
  },
  beforeCreate() {
    //pred da se kreira se zimaat tiketite
    this.$store
      .dispatch("getTickets")
      .then(allTickets => {
        allTickets.data.forEach(ticket => {
          ticket.combination = ticket.combination.split(",");
          ticket.lose = false;
          ticket.win = false;
          ticket.pending = false;

          if(ticket.status == "Lose"){
            ticket.lose = true;
          }else if(ticket.status == "Pending"){
            ticket.pending = true;
          }else{
            ticket.win = true;
          }
        });
        this.tickets = allTickets.data;
      })
      .catch(err => console.log(err));

    //se zimaat site prethodni rundi
    this.$store
      .dispatch("getResults")
      .then(resp => {
        resp.data.forEach(round => {
          round.winningCombination = round.winningCombination.split(",");
        });
        this.rounds = resp.data;
      })
      .catch(err => console.log(err));
  },
  computed: {
    isAdmin: function() {
      return this.$store.getters.isAdmin;
    }
  },
  methods: {
    createTicket() {
      this.isCreateTicket = !this.isCreateTicket;
    },
    placeTicket() {
      let data = {
        combination: this.numbers.join(","),
        id: 0,
        status: "pending",
        awardBalance: 0
      };
      this.numbers = [];
      //povik na akcija za stvanje na tiket
      this.$store
        .dispatch("placeTicket", data)
        .then(resp => {
          this.message = resp.data;
        })
        .catch(err => console.log(err));

      this.isCreateTicket = !this.isCreateTicket;
      this.placedTicket = !this.placedTicket;

      //zimanje pak na tiketite site od userot
      setTimeout(() => {
        this.placedTicket = !this.placedTicket;
        this.$store
          .dispatch("getTickets")
          .then(allTickets => {
            allTickets.data.forEach(ticket => {
              ticket.combination = ticket.combination.split(",");
            });
            this.tickets = allTickets.data;
          })
          .catch(err => console.log(err));
      }, 3000);
    },
    onReset(evt) {
      evt.preventDefault()
      this.numbers = []
    },
    startRound() {
      this.$store
        .dispatch("startRound")
        .then(resp => {
          console.log(resp);
        })
        .catch(err => console.log(err));

      this.$store
        .dispatch("getResults")
        .then(resp => {
          this.rounds = resp.data;
        })
        .catch(err => console.log(err));
    }
  }
};
</script>

<style scoped>
* {
  font-size: 21px;
}

#createTicket{
  margin: 10px 0;
  border: 2px solid #856404;
  padding: 10px;
}

.buttons{
  display: inline;
}

button {
  text-align: left;
  margin: 5px;
  padding: 3px;
  display: block;
}
h1 {
  text-align: left;
  color: orangered;
}

li {
  text-align: left;
  list-style-type: none;
}

.roundNumbers {
  text-align: left;
  display: inline-block;
}

.numbers{
  text-align: left;
  display: inline-block;
}

.card-body {
  background-color: rgb(180, 180, 180);
}

h2 {
  display: inline;
}

span {
  font-size: 25px;
  text-align: left;
}

#ticket {
  background-color: rgb(204, 203, 203);
  padding: 20px;
  margin: 0 auto;
}

#numbers {
  border-radius: 50%;
  width: 55px;
  height: 36px;
  padding: 8px;
  background: rgb(224, 221, 7);
  border: 2px solid #666;
  color: #666;
  text-align: center;
  font: 32px Arial, sans-serif;
}

.pending {
  color: chocolate;
}

.win{
  color: green;
}

.lose{
  color: red;
}
</style>