import React, {useEffect, useState} from 'react';
import {SafeAreaView, View, Text, Pressable, ScrollView, StyleSheet, TextInput, Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {StatusBar} from 'expo-status-bar';

const seed=[
 {id:'1',title:'تهیه گزارش عملکرد دوره‌ای',unit:'واحد برنامه‌ریزی',progress:70,status:'در حال انجام',priority:'زیاد'},
 {id:'2',title:'اجرای اقدام مصوب واحد',unit:'واحد منابع انسانی',progress:100,status:'تکمیل‌شده',priority:'متوسط'},
 {id:'3',title:'ارسال مستندات اقدام',unit:'واحد مالی',progress:20,status:'با تأخیر',priority:'زیاد'}
];

export default function App(){
 const [tab,setTab]=useState('dashboard');
 const [actions,setActions]=useState(seed);
 const [search,setSearch]=useState('');
 const [newTitle,setNewTitle]=useState('');

 useEffect(()=>{AsyncStorage.getItem('sama_actions').then(x=>x&&setActions(JSON.parse(x)))},[]);
 useEffect(()=>{AsyncStorage.setItem('sama_actions',JSON.stringify(actions))},[actions]);

 const addAction=()=>{
  if(!newTitle.trim()) return Alert.alert('SAMA','عنوان اقدام را وارد کنید.');
  setActions([{id:Date.now().toString(),title:newTitle,unit:'واحد جدید',progress:0,status:'شروع نشده',priority:'متوسط'},...actions]);
  setNewTitle('');
  setTab('actions');
 };
 const shown=actions.filter(a=>a.title.includes(search)||a.unit.includes(search));
 const completed=actions.filter(a=>a.status==='تکمیل‌شده').length;
 const inProgress=actions.filter(a=>a.status==='در حال انجام').length;
 const delayed=actions.filter(a=>a.status==='با تأخیر').length;

 return <SafeAreaView style={s.safe}><StatusBar style="dark"/>
  <View style={s.header}><Text style={s.brand}>SAMA</Text><Text style={s.sub}>نظام مدیریت عملکرد</Text></View>
  {tab==='dashboard'&&<ScrollView contentContainerStyle={s.page}>
    <Text style={s.h1}>داشبورد عملکرد</Text>
    <View style={s.cards}>
      <Card n={actions.length} t="کل اقدامات"/>
      <Card n={completed} t="تکمیل‌شده"/>
      <Card n={inProgress} t="در حال انجام"/>
      <Card n={delayed} t="با تأخیر"/>
    </View>
    <Text style={s.section}>آخرین اقدامات</Text>
    {actions.slice(0,5).map(a=><Action key={a.id} a={a}/>)}
  </ScrollView>}
  {tab==='actions'&&<ScrollView contentContainerStyle={s.page}>
    <Text style={s.h1}>اقدامات مصوب</Text>
    <TextInput value={search} onChangeText={setSearch} placeholder="جستجوی اقدام یا واحد..." style={s.input}/>
    {shown.map(a=><Action key={a.id} a={a}/>)}
  </ScrollView>}
  {tab==='reports'&&<ScrollView contentContainerStyle={s.page}>
    <Text style={s.h1}>گزارش پیشرفت</Text>
    <Text style={s.note}>گزارش‌های پیشرفت در این نسخه به‌صورت آفلاین روی گوشی ذخیره می‌شوند.</Text>
    {actions.map(a=><View key={a.id} style={s.report}><Text style={s.bold}>{a.title}</Text><Text>{a.unit} • {a.progress}%</Text></View>)}
  </ScrollView>}
  {tab==='admin'&&<ScrollView contentContainerStyle={s.page}>
    <Text style={s.h1}>مدیریت اقدامات</Text>
    <TextInput value={newTitle} onChangeText={setNewTitle} placeholder="عنوان اقدام جدید" style={s.input}/>
    <Pressable style={s.primary} onPress={addAction}><Text style={s.primaryText}>ثبت اقدام</Text></Pressable>
    <Text style={s.note}>این نسخه پایه، معماری SAMA را برای توسعه‌های بعدی آماده می‌کند: واحدها، کاربران، KPI، کارنامه و داشبورد مدیریتی.</Text>
  </ScrollView>}
  <View style={s.nav}>
   <Nav label="داشبورد" active={tab==='dashboard'} onPress={()=>setTab('dashboard')}/>
   <Nav label="اقدامات" active={tab==='actions'} onPress={()=>setTab('actions')}/>
   <Nav label="گزارش‌ها" active={tab==='reports'} onPress={()=>setTab('reports')}/>
   <Nav label="مدیریت" active={tab==='admin'} onPress={()=>setTab('admin')}/>
  </View>
 </SafeAreaView>
}
function Card({n,t}){return <View style={s.card}><Text style={s.num}>{n}</Text><Text>{t}</Text></View>}
function Action({a}){return <View style={s.action}><Text style={s.bold}>{a.title}</Text><Text style={s.muted}>{a.unit} • اولویت: {a.priority}</Text><View style={s.bar}><View style={[s.fill,{width:`${a.progress}%`}]}/></View><Text style={s.muted}>{a.status} — {a.progress}%</Text></View>}
function Nav({label,active,onPress}){return <Pressable onPress={onPress} style={s.navItem}><Text style={active?s.navActive:s.navText}>{label}</Text></Pressable>}
const s=StyleSheet.create({
 safe:{flex:1,backgroundColor:'#f5f7fa'},header:{padding:18,backgroundColor:'#fff',borderBottomWidth:1,borderBottomColor:'#e5e7eb'},brand:{fontSize:26,fontWeight:'800'},sub:{color:'#64748b',marginTop:2},
 page:{padding:16,paddingBottom:90},h1:{fontSize:24,fontWeight:'800',marginBottom:16},section:{fontSize:18,fontWeight:'700',marginTop:20,marginBottom:10},
 cards:{flexDirection:'row',flexWrap:'wrap',gap:10},card:{width:'47%',backgroundColor:'#fff',padding:16,borderRadius:14,marginBottom:4},num:{fontSize:28,fontWeight:'800',marginBottom:5},
 action:{backgroundColor:'#fff',padding:15,borderRadius:14,marginBottom:10},bold:{fontWeight:'700',fontSize:16},muted:{color:'#64748b',marginTop:5},bar:{height:8,backgroundColor:'#e5e7eb',borderRadius:8,marginTop:10,overflow:'hidden'},fill:{height:8,backgroundColor:'#2563eb'},
 input:{backgroundColor:'#fff',borderRadius:12;padding:14,marginBottom:12,borderWidth:1,borderColor:'#e2e8f0',fontSize:16},
 primary:{backgroundColor:'#2563eb',padding:15,borderRadius:12,alignItems:'center'},primaryText:{color:'#fff',fontWeight:'700'},note:{backgroundColor:'#fff',padding:15,borderRadius:12,lineHeight:24,marginTop:14},report:{backgroundColor:'#fff',padding:15,borderRadius:12,marginBottom:10},
 nav:{position:'absolute',bottom:0,left:0,right:0,height:65,backgroundColor:'#fff',borderTopWidth:1,borderTopColor:'#e5e7eb',flexDirection:'row',justifyContent:'space-around',alignItems:'center'},navItem:{padding:10},navText:{color:'#64748b'},navActive:{color:'#2563eb',fontWeight:'800'}
});