//Import Class
import {DataCovid} from "./dataCovid.js"

//Declare Variable
let positifIndo = $(".positif")
let sembuhIndo = $(".sembuh")
let meninggalIndo = $(".meninggal")
let positifNegara = $(".positifCountry")
let sembuhNegara = $(".negatifCountry")
let meninggalNegara = $(".meninggalCountry")
var dataCovid = []
var jenisChart = ""

//Function Untuk Sorting
function sortData(data, bagian) {
  data.sort(function(a, b) {
    if (a[bagian] < b[bagian]) return -1;
    if (a[bagian] > b[bagian]) return 1;
    return 0
  })
  if (bagian === "kasusPositif") {
    data.reverse()
  }
}

//Function untuk Fetch Data dari API
function ajaxAll (country, positifBox, sembuhBox, meninggalBox){
  $.ajax({
    type: "GET",
    url: "https://covid19.mathdro.id/api/countries/"+country,
    header: {
      "Access-Control-Allow-Origin": "*"
    },
    success: function(data) {
      positifBox.text(`${numeral(data.confirmed.value).format('0,0')} orang`)
      sembuhBox.text(`${numeral(data.recovered.value).format('0,0')} orang`)
      meninggalBox.text(`${numeral(data.deaths.value).format('0,0')} orang`)
    },
    error: function(){
      positifBox.text("Load Failed")
      sembuhBox.text(`Load Failed`)
      meninggalBox.text(`Load Failed`)
    }

  })
}

//Menjalankan Setelah document Setelah Selesai di Load
$(document).ready(() => {
  ajaxAll("IDN", positifIndo, sembuhIndo, meninggalIndo) //Memanggil Function Fetch Data untuk Float Data Covid

  //Fetch Data dalam bentuk JSON dari API Covid Indonesia
  $.getJSON("https://indonesia-covid-19.mathdro.id/api/provinsi", function(data){
    //Ambil Semua data dari API kemudian di masukkan dalam bentuk Object Class DataCovid
    $.each(data.data, function(id, obj){
      dataCovid.push(new DataCovid(obj.kodeProvi, obj.provinsi, obj.kasusPosi, obj.kasusSemb, obj.kasusMeni))
    })
    dataCovid.pop() //Mengeluarkan data paling terakhir dari Array dataCovid

    //Mensorting berdasarkan Pilihan Radio Button {Event Radio Button}
    $('input[name="radioButtonSort"]').each(function(){
      if (this.checked.value === "byProvince"){
        sortData(dataCovid, "id")
      } else{
        sortData(dataCovid, "kasusPositif")
      }
    });
    
    //Select Canvas
    var ctx = document.getElementById('myChart').getContext('2d');
    var myChart //Deklarasi Penampung Chart

    //Menampilkan Chart Berdasarkan Pilihan Radio Button {Event Radio Button}
    $('input[name="radioButtonChart"]').each(function(){
      if (this.checked)
      {
        jenisChart = this.value
        displayChart(this.value, dataCovid) //Memanggil Fungsi membuat Chart
      }
    });
    
    //Event Menampilkan Chart Berdasarkan Pilihan Radio Button {Event Radio Button}
    $("#line").click(function() {
      jenisChart = "line"
      displayChart(jenisChart, dataCovid);
    });
    $("#bar").click(function() {
      jenisChart = "bar"
      displayChart(jenisChart, dataCovid);
    });

    //Event Menampilkan Chart Berdasarkan Pilihan Radio Button {Event Radio Button}
    $("#byCase").click(function() {
      sortData(dataCovid, "kasusPositif");
      displayChart(jenisChart, dataCovid)
    });
    $("#byProvince").click(function() {
      sortData(dataCovid, "id");
      displayChart(jenisChart, dataCovid)
    });
    
    //Function Menampilkan Chart dengan TipeChart dan DataChart
    function displayChart(newType, data) {
      if (myChart) {
        myChart.destroy();
      }

      var configChart = {
        type: newType,
        data: {
          labels: data.map(element => element.namaTempat),
          datasets: [{
            label: 'Positif',
            borderColor: 'red',
            data: data.map(element => element.kasusPositif)
          },
          {
            label: 'Sembuh',
            borderColor: 'green',
            data: data.map(element => element.kasusSembuh)
          },
          {
            label: 'Meninggal',
            borderColor: 'black',
            data: data.map(element => element.kasusMeninggal)
          }]
        },
  
          // Configuration options go here
        options: {}
      }
      // Remove the old chart and all its event handles
      
    
      // Chart.js modifies the object you pass in. Pass a copy of the object so we can use the original object later
      var temp = jQuery.extend(true, {}, configChart);
      temp.type = newType;
      if(newType === "bar"){
        temp.data.datasets[0].backgroundColor = "red"
        temp.data.datasets[1].backgroundColor = "green"
        temp.data.datasets[2].backgroundColor = "black"
      }
      myChart = new Chart(ctx, temp);
    };
  })  

  //Fetch API untuk mengambil data Nama Negara dan Menambahkan ke dalam Select Box
  let url = "https://covid19.mathdro.id/api/countries/"
  $.getJSON(url, function(data){
    for(let i = 0; i < data.countries.length; i++) {
      if (data.countries[i].iso3 != undefined) {
        $("#mySelect").append($("<option>", { 
          value: data.countries[i].iso3,
          text : data.countries[i].name
        }));
      } 
    }
    
    $("#mySelect option[value=IDN]").attr("selected","selected"); //Set Selected Option Indonesia
    //Memanggil Function Fetch Data untuk kolom CaseDunia berdasarkan selected option
    ajaxAll($("#mySelect option:selected").val(), positifNegara, sembuhNegara, meninggalNegara)

    //{Event Change SelectBox}
    $("select#mySelect").change(function(){
      var selectedCountry = $(this).children("option:selected").val();
      //Memanggil Function Fetch Data untuk kolom CaseDunia berdasarkan selected option
      ajaxAll(selectedCountry, positifNegara, sembuhNegara, meninggalNegara)
    });
  })

  //Animasi Sederhana untuk Component Team
  $(".seeMore").on("click", function(){
    setTimeout(function(){ 
      $(".single-team").animate({opacity: 0}).animate({opacity: 1}, "slow")
    })
  })
  
  //Event Mouse untuk Float Data Kasus
  $(".kasus").mouseover(function(e){
    $(".kasus").children().css({
      "width":"200px", 
      "border-radius": "8%", 
      "padding-left":"10px", 
      "color":"black"})
  })
  
  $(".kasus").mouseout(function(e){
    $(".kasus").children().css({
      "width":"50px", 
      "border-radius": "10%", 
      "padding-left":"0px", 
      "color":"transparent"
    })
  })
})




