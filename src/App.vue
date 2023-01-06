<template>
<div>
  <b-navbar variant="success" type="dark">
    <b-navbar-brand align="center">
      Work task manager 3.0
    </b-navbar-brand>
  </b-navbar>
  <b-container>
  <b-row class="text-center">
    <b-col>
        <b-button @click="task_modal = !task_modal" variant="warning">
          Uusi tehtävä
        </b-button>
    </b-col>
  </b-row>  
  <b-row class="text-center">
    <b-col>
      <b-button @click = "endday_modal = !endday_modal" variant="success">Lopeta päivä
      </b-button>         
      <b-button @click = "pause.status = !pause.status" :variant="pause.status ? 'warning': 'primary'">
        <div v-if = "!pause.status">Pause</div>
        <div v-if = "pause.status">Jatka</div>
      </b-button>    
    </b-col>
    <b-col>
      <All_tasks_modul 
      :todos="todos"
      :mmseconds2time="mmseconds2time"
      :remove_tasks_all="remove_tasks_all"
      />
    </b-col>
    <b-col>
      <Done_work_modul 
      :Done_day_task="Done_day_task" 
      :mmseconds2time="mmseconds2time"
      :remove_donetask_history_all="remove_donetask_history_all"
      />
    </b-col>
  </b-row>
  <b-row class="text-center" v-if="startTime != 0">
    <b-col>
        <h5><b>Työpäivä alkoi: </b>{{ moment(DaystartTime).format("HH:mm") }}
        </h5>
    </b-col>
    <b-col>
      <h5>
        <b>Työaikaa kulunut tänään:</b> {{ mmseconds2time(spentTime) }}
      </h5>
    </b-col>
  </b-row>
</b-container> 
  <h2 style = "text-align:center;"><b>Tehtävät</b></h2>
  <b-list-group v-for = "(todo, index) in todos"
      :key="index">
      <b-list-group-item
     class="flex-column align-items-start" :style = "task_tag_color(todo)" v-if="todo.status != 2">
       
    <div class="d-flex w-100 justify-content-between">
      <h5 class="mb-1" @click = "namechange_modal = !namechange_modal; namechange = todo"><b>{{ todo.content }}</b></h5>
      <small v-if="get_task_spend_time(todo.content)">
        Tänän käytetty aika: {{get_task_spend_time(todo.content)}}
      </small>
      <small>
        Aikaa käytetty tähän: {{ mmseconds2time(todo.time_spend) }}
      </small>
    </div>
    <b-container fluid>
      <b-row>
        <b-col>
          <b-button variant="primary" @click = "startTask(todo)">
            <font-awesome-icon icon="play" />
            <b-badge v-if="todo.status == 1" variant="danger" text-indicator>
              Käynissä
            </b-badge> 
          </b-button>
        </b-col>
        <b-col>
          <b-badge variant="info" v-if="todo.prio == 1"> Tärkeys:{{todo.prio}} </b-badge>
          <b-badge variant="warning" v-if="todo.prio == 2"> Tärkeys:{{todo.prio}} </b-badge>
          <b-badge variant="danger" v-if="todo.prio == 3"> Tärkeys:{{todo.prio}} </b-badge>
        </b-col>
        <b-col md="5">
          <b v-if="form_dday(todo)">
            Määräaika:</b> {{form_dday(todo)}}
        </b-col>
        <b-col>
          <b v-if="todo.tag.text">
            Tägi:
          </b> 
          <b-badge variant="light">
            {{todo.tag.text}}
          </b-badge>
        </b-col>
        <b-col>
            <b-button variant="success" @click = "todo.status = 2; saveData()">
              <font-awesome-icon  icon="check" />
            </b-button>        
            <b-button  variant="danger" @click = "removeTodo(index)">
              <font-awesome-icon icon="remove" />
            </b-button>
        </b-col>
      </b-row>
    </b-container>
  </b-list-group-item>
  </b-list-group>
  <h4 v-if="todos.length === 0">Ei tehtäviä</h4>

  <b-modal v-model="task_modal" @ok="addTodo()">
      <b-form @submit="addTodo()">
        <b-form-group
          label="Tehtävä"
          label-for="name-input"
          >
          <b-form-input
            id="name-input"
            name = "NewTodo"
            v-model="new_task.content"
            required> 
          </b-form-input>
        </b-form-group>    
        <b-form-group
          label="Deadline"
          label-for="name-input">      
          <b-form-input
            id="toinen"
            name = "kalakeitto"
            type = "date"
            v-model = "new_task.dday">  
          </b-form-input>
        </b-form-group>
        <b-form-group
          label = "Prio (isompi on tärkeämpi)"
          label-for = "prio-input">
          <b-form-spin-button id = "prio-input" v-model = "new_task.prio"  min="1" max="3" step="1" inline/>
        </b-form-group>
        <b-form-group
          label = "Täg"
          label-for = "select-tag"
        >
          <b-form-select id ="select-tag" v-model="new_task.tag">
            <option :value="null" disabled>
              --   Valitse tagi --
            </option>
            <option v-for="tag in tags" :key="tag" :value = "tag">
              {{ tag.text }}
            </option>
          </b-form-select>
          <b-button @click="tags_modal = !tags_modal">lisää tag
          </b-button>          
          <b-button @click="remove_tag()">Poista tag
          </b-button>
        </b-form-group>

      </b-form>
    </b-modal>
    <b-modal v-model = "tags_modal" @ok="add_tag()">
      <label>Nimi:</label>
      <b-form-input type="text" v-model = "new_tag.text"></b-form-input>
      <label>Valitse väri:</label>
      <b-form-input type="color" v-model = "new_tag.value"></b-form-input>
    </b-modal>      
    <b-modal v-model = "namechange_modal">
      <label for="namechage-1">Tehtävä nimike</label>
      <b-form-input id = "namechage-1" type="text" v-model = "namechange.content"></b-form-input>
    </b-modal>    
    <b-modal title = "Työpäivän kuvaus" v-model = "endday_modal" @ok="end_day()">
       <b-form-textarea @submit="end_day()"
        id="textarea-small" 
        size="sm" 
        placeholder="Kuvaile mitä teit tänään" 
        v-model="endday_descri"
        ></b-form-textarea>
    </b-modal>
  </div>
</template>
  
  <script>
    import { ref} from 'vue';
    import Done_work_modul from './components/Done_work_modul.vue'
    import All_tasks_modul from './components/All_tasks_modul.vue'
    import moment from 'moment';
    export default{
      //name: 'WorkT"askManager_3',
    components: {
      Done_work_modul,
      All_tasks_modul
    },
    setup(){
      const newTodo = ref('');
      const startTime = ref(0)
      const DaystartTime = ref(0)
      const spentTime = ref(0)
      const now_task = ref('')
      const day_tasks = ref({})
      const Done_day_task = ref([])
      const task_modal = ref(false)
      const endday_modal = ref(false)
      const namechange_modal = ref(false)
      const namechange = ref({})
      const endday_descri = ref('')
      const pause = ref({
        state: false,
        time_start:0,
        time_spend: 0
      })
      const name = ref('')
      const date = ref('')
      const tags_modal = ref(false)
      const def_tag = {text:"", value:"", hsl:[0, 0, 100, 0]}
      const new_tag = ref({text:"", value:"", hsl: [0, 0, 100, 0]})
      const defaultData = [{
        id: 1,
        status: 0,
        content: '',
        time_spend: 0,
        prio: 0,
        dday: 'now',
        tag: JSON.parse(JSON.stringify(def_tag))

      }]      
      const new_task = ref({
        id: 1,
        status: 0,
        content: '',
        time_spend: 0,
        prio: 0,
        dday: 'now',
        tag: JSON.parse(JSON.stringify(def_tag))

      })
      const todosData = JSON.parse(localStorage.getItem('todos')) || [];
      const todos = ref(todosData);
      const tagsData = JSON.parse(localStorage.getItem('tags')) || [def_tag];      
      const tags = ref(tagsData)
      const DoneTaskData = JSON.parse(localStorage.getItem('DoneTask')) || [];
      Done_day_task.value = DoneTaskData
      set_all_status_zero();
      add_lounas();
      function addTodo () {
        //console.log(new_task.value)
        if (new_task.value.content.length > 2){
          todos.value.push(JSON.parse(JSON.stringify(new_task.value)))
          new_task.value = {...defaultData[0]};
          task_modal.value = !task_modal.value
          saveData();
        }
      }
      function form_dday(task){
        if(task.dday == "" || task.dday == "now"){
          return ""
        }
        return moment(task.dday).format("DD.MM.YY")
      }
      function removeTodo (index) {
        todos.value.splice(index, 1);
        saveData();
      }
      function startTask (task) {
        if(task.status == 1){
          return 0
        }
        let now_time = new Date()
        if(!(task.content in day_tasks.value)){
          day_tasks.value[task.content] 
            = {starttime: now_time.getTime(), spendtime: 0}
        }
        if (startTime.value != 0){
          now_task.value.time_spend += now_time.getTime() - startTime.value
          now_task.value.status = 0
          now_task.value.tag.hsl[3] = 0.5
        }else{
          DaystartTime.value = now_time.getTime()
        }
        now_task.value = task
        now_task.value.status = 1 // doing
        now_task.value.tag.hsl[3] = 1 
        startTime.value = now_time.getTime();
        day_tasks.value[now_task.value.content].starttime = now_time.getTime();
        //console.log(day_tasks.value)
      }
      function saveData () {
        const storageData = JSON.stringify(todos.value);
        //console.log(storageData)
        localStorage.setItem('todos', storageData);
      }

      function set_all_status_zero(){
        //console.log("Alustetaan kaikki työt")
        todosData.forEach(function(task) {
          if(task.status == 1){
            task.status = 0
          }
          task.tag.hsl[3] = 0.5 
        })

      }

      function end_day(){
        if(startTime.value != 0){
          //console.log(day_tasks)
          let now_time = new Date()
          save_day_tasks()
          endday_descri.value = ''
          now_task.value.status = 0
          now_task.value.tag.hsl[3] = 0.5
          now_task.value.time_spend += now_time.getTime() - startTime.value
          startTime.value = 0
          DaystartTime.value = 0
          saveData();
        }
      }

      function remove_donetask_history_all(){
        Done_day_task.value = []
        const storageData = JSON.stringify(Done_day_task.value);
        localStorage.setItem('DoneTask', storageData);
      }      
      function remove_tasks_all(){
        todos.value = []
        const storageData = JSON.stringify(todos.value);
        localStorage.setItem('todos', storageData);
      }

      function save_day_tasks(){
        const day_task = {
          day:DaystartTime.value,
          task: {},
          spend_time:spentTime.value,
          descri:endday_descri.value
        }
        Object.keys(day_tasks.value).forEach(key => {
          day_task.task[key] =day_tasks.value[key].spendtime
        })
        Done_day_task.value.unshift(day_task)
        // Save day done task
        const storageData = JSON.stringify(Done_day_task.value);
        localStorage.setItem('DoneTask', storageData);
        day_tasks.value = {}
        //console.log(Done_day_task.value)
        //console.log(day_task)

      }

      function add_tag(){
        //console.log("Lisätään tägi")
        new_tag.value.hsl = hexToHSL(new_tag.value.value)
        tags.value.push(new_tag.value)
        new_tag.value = {...def_tag}
        //console.log(tags.value)
        const storageData = JSON.stringify(tags.value);
        localStorage.setItem('tags', storageData)
      }
       function task_tag_color(task){
        if (task.tag === undefined || task.tag === ""){
          return {}
        }
        if("hsl" in task.tag){
          return {"background-color":
          "hsla(" + task.tag.hsl[0] + ", " + task.tag.hsl[1] + "%, " + task.tag.hsl[2] + "%," + task.tag.hsl[3] +")"
                }
        }
       }

       function remove_tag(){
        const index = tags.value.indexOf(new_task.value.tag)
        if (index > -1) { // only splice array when item is found
          tags.value.splice(index, 1); // 2nd parameter means remove one item only
          const storageData = JSON.stringify(tags.value);
        localStorage.setItem('tags', storageData)
        }
       }

       function add_lounas(){
        if (!todos.value.find(e => e.content === 'Lounas')) {
          todos.value.push({
            id: 1,
            status: 0,
            content: 'Lounas',
            time_spend: 0,
            prio: 0,
            dday: 'now',
            tag: {text:"lounas", value:"#84bf40", hsl:[88, 50, 50, 0.5]}
          })
        }
       }

       function get_task_spend_time(content){
        if(content in day_tasks.value){
          return mmseconds2time(day_tasks.value[content].spendtime)
        }
       }

       function muuta_nime(){
        console.log(namechange)
       }

      setInterval(() => {
        const now_time = new Date()
        if(DaystartTime.value != 0)
          if(pause.value.status ){
            day_tasks.value[now_task.value.content].starttime = now_time.getTime()
          }
          else{
            // spentTime.value = now_time.getTime() - DaystartTime.value
              day_tasks.value[now_task.value.content].spendtime += now_time.getTime() -day_tasks.value[now_task.value.content].starttime
              spentTime.value += now_time.getTime() -day_tasks.value[now_task.value.content].starttime
              day_tasks.value[now_task.value.content].starttime = now_time.getTime()

          }

      }, 1000)


       function mmseconds2time(mmseconds){
        const seconds = Math.floor((mmseconds / 1000) % 60);
        if(mmseconds == 0 || mmseconds === undefined){
          return '00:00'
        }
        const minutes = Math.floor((mmseconds / 1000 / 60) % 60);
        const hours = Math.floor((mmseconds / 1000 / 60 / 60) % 24);

        return [
          hours.toString().padStart(2, "0"),
          minutes.toString().padStart(2, "0"),
          seconds.toString().padStart(2, "0")
          ].join(":");
       }
       function hexToHSL(H) {
        // Convert hex to RGB first
        let r = 0, g = 0, b = 0;
        if (H.length == 4) {
          r = "0x" + H[1] + H[1];
          g = "0x" + H[2] + H[2];
          b = "0x" + H[3] + H[3];
        } else if (H.length == 7) {
          r = "0x" + H[1] + H[2];
          g = "0x" + H[3] + H[4];
          b = "0x" + H[5] + H[6];
        }
        // Then to HSL
        r /= 255;
        g /= 255;
        b /= 255;
        let cmin = Math.min(r,g,b),
            cmax = Math.max(r,g,b),
            delta = cmax - cmin,
            h = 0,
            s = 0,
            l = 0;

        if (delta == 0)
          h = 0;
        else if (cmax == r)
          h = ((g - b) / delta) % 6;
        else if (cmax == g)
          h = (b - r) / delta + 2;
        else
          h = (r - g) / delta + 4;

        h = Math.round(h * 60);

        if (h < 0)
          h += 360;

        l = (cmax + cmin) / 2;
        s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
        s = +(s * 100).toFixed(1);
        //l = +(l * 100).toFixed(1);

        return [h, s, 50, 0.5];
      }

      window.addEventListener('beforeunload', (event) => {
          event.preventDefault();
          event.returnValue = '';
            }
          )
      return {
        todos,
        newTodo,
        addTodo,
        removeTodo,
        saveData,
        startTask,
        startTime,
        spentTime,
        set_all_status_zero,
        end_day,
        task_modal,
        name,
        date,
        add_tag,
        new_task,
        tags,
        tags_modal,
        new_tag,
        task_tag_color,
        mmseconds2time,
        DaystartTime,
        get_task_spend_time,
        remove_tag,
        save_day_tasks,
        Done_day_task,
        endday_modal,
        endday_descri,
        moment,
        form_dday,
        remove_donetask_history_all,
        remove_tasks_all,
        muuta_nime,
        namechange_modal,
        namechange,
        pause

      }
    }
  }
</script>

<style>
</style>
