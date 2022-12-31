<template>
  <div>
    <b-button @click = "all_tasks_modal = !all_tasks_modal" variant="info">Tehdyt työt</b-button> 
    <b-modal v-model = "all_tasks_modal">
      <template #header>
        <b-button variant="danger" @click="remove_tasks_all()">
          Poista kaikki historia
        </b-button>
      </template>
      <b-card v-for = "tasks in todos"
      :key="tasks"
    > 
        <template #header>
          <h4>{{ tasks.content }}</h4>
        </template>
          Kulunut aika:{{mmseconds2time(tasks.time_spend)}}
          <br>
          <b-badge variant="info" v-if="tasks.prio == 1"> Tärkeys:{{tasks.prio}} </b-badge>
        <b-badge variant="warning" v-if="tasks.prio == 2"> Tärkeys:{{tasks.prio}} </b-badge>
        <b-badge variant="danger" v-if="tasks.prio == 3"> Tärkeys:{{tasks.prio}} </b-badge> 
        <b-badge variant="success" v-if="tasks.status == 2"> Tehty </b-badge>
      </b-card>
    </b-modal>
  </div>
</template>

<script>
  import { ref} from 'vue';
  //import moment from 'moment';
  export default {
    props:{
      todos: Array,
      mmseconds2time: Function,
      remove_tasks_all: Function
    },
    setup() {
      const all_tasks_modal = ref(false)
      return {
        all_tasks_modal,
        //moment
      };
    },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
