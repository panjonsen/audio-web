<template>


  <n-config-provider :theme="theme">


    <n-card title="Audio" style="margin-bottom: 16px">
      <n-tabs
          type="line" animated
          :value="audioTabValue"
          @click="audioTabClick(name)"

          @before-leave="beforTab"
      >
        <n-tab-pane name="AudioImport" tab="音频文件导入">


          <!--          导入文件代码-->
          <n-upload
              multiple
              directory-dnd
              :action="updateUrl"
              @before-upload="beforeUpload"
              @finish="finish"
              :name="updateField"

          >
            <n-upload-dragger>

              <n-text style="font-size: 16px">
                点击或者拖动文件到该区域来上传
              </n-text>

            </n-upload-dragger>
          </n-upload>


          <!--          数据表格-->
          <!--          :striped  隔行换色  斑马纹-->
          <!--          <n-data-table-->
          <!--              :single-line="false"-->
          <!--              :columns="columns"-->
          <!--              :data="data.Song"-->
          <!--              :pagination="pagination"-->
          <!--              :striped="true"-->

          <!--          />-->

          <n-data-table
              :single-line="false"
              :columns="columns"
              :data="data"
              :row-class-name="rowClassName"
              :striped="true"
          />


        </n-tab-pane>


        <n-tab-pane name="AudioKil" tab="音频文件处理">
          <n-gradient-text type="info">
            {{ Batch_ZipName }}
          </n-gradient-text>

          <n-data-table
              :single-line="false"
              :columns="columnsAudio"
              :data="dataAuido"
              :row-class-name="rowClassName"
              :striped="true"
          />
        </n-tab-pane>


        <n-tab-pane name="TxCloundInfo" tab="音频可用时长">
          七里香
        </n-tab-pane>

        <n-tab-pane name="Aero" tab="主题设置">
          <n-button @click="theme = darkTheme">
            深色
          </n-button>
          <n-button @click="theme = null">
            浅色
          </n-button>
        </n-tab-pane>


      </n-tabs>
    </n-card>
  </n-config-provider>


</template>

<script lang="ts">
import {h, defineComponent, reactive, ref} from 'vue'
import {darkTheme, UploadFileInfo} from 'naive-ui'
import {NTag, NButton, useMessage} from 'naive-ui'
import type {GlobalTheme, DataTableColumns} from 'naive-ui'
import {onMounted} from 'vue'
import {GetAudioBatchList, GetAudioListByBatchId} from '../api';

const audioTabValue = ref("");

const dataAuido: Audio[] = ref([])

const audioTabClick = (tabName) => {
  // console.log(tabName);
  audioTabValue.value = tabName;

  if (tabName == "AudioImport") {

    // console.log(dataAuido)
  }
}
audioTabClick("AudioImport");

//--音频文件处理数据表格
type Audio = {
  Index: number
  AudioName: string
  State: number
  WarnCount: number
  KeyWords: string
}


const createColumnsAudio = ({play}: {
  play: (row: Audio) => void,

}): DataTableColumns<Audio> => {
  return [
    {
      title: '#',
      key: 'Index',
      render(row, index) {
        return h('div', {}, [index + 1]);
      }

    },
    {
      title: '音频文件名',
      key: 'AudioName'
    },
    {
      title: '铭感次数',
      key: 'WarnCount',
      align:'center',
      width:'90px',
      render(row) {

        return h(
            NTag,
            {
              style: {
                marginRight: '6px',
                marginTop: '5px'

              },
              type: 'warning',
              bordered: false
            },
            {
              default: () => row.WarnCount
            }
        )
      }
    },
    {
      title: '铭感标签',
      key: 'KeyWords',
      render(row) {
        var taglist = row.KeyWords.split(",");

        const tags = taglist.map((tagKey) => {
          return h(
              NTag,
              {
                style: {
                  marginRight: '6px',
                  marginTop: '5px',
                },
                type: 'error',
                bordered: false
              },
              {
                default: () => tagKey
              }
          )
        })

        return tags

      }
    },
    {
      title: '状态',
      key: 'State',
      render(row) {
        if (row.State == 0) {
          return h('div', {}, ['等待识别中'])
        }
        if (row.State == 1) {
          return h('div', {}, ['识别完成'])
        }
        if (row.State == 2) {
          return h('div', {}, ['无法识别'])
        }

      }


    },
    {
      title: 'Action',
      key: 'actions',
      render(row) {
        //默认禁用 如果状态符合 则启用
        var dis = true;
        if (row.State == 1) {
          dis = false

        }
        return h(
            NButton,
            {
              strong: true,
              tertiary: true,
              size: 'small',
              disabled: dis,
              onClick: () => play(row)
            },
            {default: () => '查看'}
        )
      }
    }
  ]
}


//--音频文件压缩包导入
type Song = {
  BatchId: number
  FileName: string
  State: number
  FileCount: number
  LoginId: string
  LoginIp: string
  Md5: string
  WarnCount: number
}

const createColumns = ({play}: {
  play: (row: Song) => void
}): DataTableColumns<Song> => {
  return [
    {
      title: '批次ID',
      key: 'BatchId'
    },
    {
      title: '文件名',
      key: 'FileName'
    },
    {
      title: '状态',
      key: 'State',
      render(row) {
        if (row.State == 0) {
          return h('div', {}, ['等待处理中'])
        }
        if (row.State == 1) {
          return h('div', {}, ['正在处理中'])
        }
        if (row.State == 2) {
          return h('div', {}, ['处理完成'])
        }

      }


    },
    {
      title: 'Action',
      key: 'actions',
      render(row) {
        //默认禁用 如果状态符合 则启用
        var dis = true;
        if (row.State == 2) {
          dis = false

        }
        return h(
            NButton,
            {
              strong: true,
              tertiary: true,
              size: 'small',
              disabled: dis,
              onClick: () => play(row)
            },
            {default: () => '查看'}
        )
      }
    }
  ]
}
const data: Song[] = ref([])


var GetBatchList = () => {
  GetAudioBatchList().then(rsp => {
    data.value = rsp.data.data
  }).catch(
      err => {
        console.log('err:' + err)
      }
  );
}

const GetAudioList = (batchId) => {
  GetAudioListByBatchId({
    BatchId: batchId
  }).then(rsp => {
    // console.log ("GetAudioList:");
    // console.log(rsp.data.data)
    dataAuido.value = rsp.data.data
  }).catch(
      err => {
        console.log('err:' + err)
      }
  );

};


const Batch_ZipName = ref("请到前一个标签页点击查看会自动跳转到这");
export default defineComponent({

  setup(props, ctx) {

    //ref 初始化 防止数据不会动态更新


    onMounted(() => {
      GetBatchList();


    })

    const message = useMessage()
    return {
      darkTheme,
      data,
      dataAuido,
      GetAudioList,
      audioTabClick,
      theme: ref<GlobalTheme | null>(darkTheme),
      async beforeUpload(data: {
        file: UploadFileInfo
        fileList: UploadFileInfo[]
      }) {
        if (data.file.file?.type !== 'application/x-zip-compressed') {
          message.error('只能上传Zip文件格式，请重新上传')
          return false
        }
        return true
      },
      async finish(data: {
        file: UploadFileInfo
        event?: ProgressEvent
      }) {
        // console.log("finish");
        // console.log(data);
        //转Json对象 方便处理返回结果
        var rp = event.target.response;
        var json = JSON.parse(rp);
        if (json.code == 200) {
          message.success(json.msg)
          //上传成功后获取一次列表
          GetBatchList()
        } else {
          message.error(json.msg)
        }

        return false;
      },
      updateUrl: '/api/record/index/UpdateAudioZip',
      updateField: "zip",
      audioTabValue,
      Batch_ZipName
      ,
      columns: createColumns({
        play(row: Song) {

          audioTabClick("AudioKil")
          GetAudioList(row.BatchId);
          Batch_ZipName.value = "Zip文件名称:" + row.FileName;
          //message.info(`Play ${row.FileName}`)
        }
      }),
      columnsAudio: createColumnsAudio({
        play(row: Audio) {
          message.info(`Play ${row.AudioName}`)
        }
      }),
      async beforTab(data: {
        name: string,
        oldName: string
      }) {


        if (data == "AudioImport") {
          Batch_ZipName.value = "请到前一个标签页点击查看会自动跳转到这";
          dataAuido.value = [];
        }
        console.log(data)
        return true
      },


    }

  }
})

</script>


