<template>
  <div>
    <b-button @click = "worktask_modal = !worktask_modal" variant="info">Tehdyt tunnit</b-button> 
    <b-modal v-model = "worktask_modal">
      <template #header>
        <b-button variant="danger" @click="remove_donetask_history_all()">
          Poista kaikki historia
        </b-button>
      </template>
      <b-card v-for = "tasks in Done_day_task"
      :key="tasks"
    >
      <template #header>
        <h4>Aika: {{moment(tasks.day).format("DD.MM.YY HH:mm")}}</h4>
      </template>
      <h4>Työtehtävät:</h4>
      <ul>
        <li v-for = "(task, index) in tasks.task" :key="task">
          <b>{{ index }}:</b> {{mmseconds2time(task)}}
          
        </li>
      </ul>
      <h5>Päivän kuvaus:</h5>
      {{ tasks.descri}}
      <template #footer>
        <b> Tunnit yhteensä:</b> {{ mmseconds2time(tasks.spend_time)}}
      </template>
      </b-card>
    </b-modal>
  </div>
</template>

<script>
  import { ref} from 'vue';
  import moment from 'moment';
  export default {
    props:{
      Done_day_task: Array,
      mmseconds2time: Function,
      remove_donetask_history_all: Function,
    },
    setup() {
      const worktask_modal = ref(false)
      return {
        worktask_modal,
        moment
      };
    },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
