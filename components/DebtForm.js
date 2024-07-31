import { StyleSheet, Text, TouchableOpacity, View,Modal,FlatList,Dimensions ,ActivityIndicator} from 'react-native'
import React,{useState,useEffect,useRef} from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigation,useRoute } from '@react-navigation/native';
import { useAuth } from '../pages/AuthContext';
import Icon from 'react-native-vector-icons/FontAwesome5';
import axios from 'axios';


const { width, height } = Dimensions.get('window');


export default function DebtForm({loanid,status,payStatus,amount,date1,date2,color,id,emiData}) {
  const {t} =useTranslation();
  const navigation = useNavigation();
  const { state, handleLogout } = useAuth();
  const [showEmi,setShowEmi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loading1, setLoading1] = useState(true);
  const [loan, setLoan] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
 
  console.log("Debtform",id);
  const api="https://pnf-backend.vercel.app/"
    // const api="http://10.0.2.2:5000"

    useEffect(() => {
      if(typeof id !== 'undefined'){
        handleClick();
      }
    },[]);

  // useEffect(()=>{
  //   // console.log('Fetching Emi Data');
  //   fetchEmiData(state.loginForm.mobileNumber);
  // },[])


  // const fetchEmiData = async (mobileNumber)=>{
  //   // console.log("mobileNumber",mobileNumber)
  //   const modifiedMobileNumber = mobileNumber.length > 10 ? mobileNumber.slice(-10):mobileNumber;
  //   console.log("Mobile number Loan",modifiedMobileNumber);
  //   try{
  //     // setLoading1(true);
  //     let url=`${api}/emi?criteria=sheet_26521917.column_35.column_87%20LIKE%20%22%25${encodeURIComponent(modifiedMobileNumber)}%22`;
  //     const res = await axios.get(url);
  //     // Group emiData by loan ID
  //       const groupedEmiData = res.data.data.reduce((acc, emi) => {
  //           const loanId = emi['loan id'];
  //           if (!acc[loanId]) {
  //           acc[loanId] = [];
  //           }
  //           acc[loanId].push(emi);
  //           return acc;
  //       }, {});
  //     setEmiData(groupedEmiData);
  //     setLoading(false);
  //     // console.log(res.data.data);
  //     // console.log(groupedEmiData);
  //   }catch(err){
  //     console.error('Error fetching data: ',err.message);
  //   }
  // }


  const handleClick=() =>{
    // navigation.navigate('Dash')
        const initialShowEmi = emiData[id] || [];
        // setLoading1(true);
        setShowEmi(initialShowEmi);
        // setShowEmi(emiData[id1])
        setLoan(id)
        // console.log(id1);
        setIsModalVisible(true);
        setLoading1(false);
  }

  const handleClick1=()=>{
        const id1=loanid.slice(9)
        const initialShowEmi = emiData[id1] || [];
        // setLoading1(true);
        // setLoading(true);
        setShowEmi(initialShowEmi);
        // setShowEmi(emiData[id1])
        setLoan(id1)
        // console.log(id1);
        // setLoading(false);
        setIsModalVisible(true);
        setLoading1(false);
  }

 
  const closeModal = () => {
    setIsModalVisible(false);
  }
  
  // console.log(emiData["983"]);
  // const showEmi = emiData.filter(emi => emi)
  return (
    <TouchableOpacity style={styles.FormContainer} onPress={handleClick1}>
          <View style={styles.Container}>
            <Text style={{fontSize:18,fontWeight:'600',color:'#444444',lineHeight:28}}>{loanid}</Text>
            <View style={styles.InnerContainer}>
                <Text style={{fontSize:14,lineHeight:20}}>{status}: </Text>
                <Text style={{fontSize:14,lineHeight:20,color:color}}>{payStatus}</Text>
            </View>
          </View>
          <Text style={{marginBottom:8,color:'#555555'}}>{amount}</Text>
          <Text style={{marginBottom:8,color:'#555555'}}>{date1}</Text>
          <Text style={{marginBottom:8,color:'#555555'}}>{date2}</Text>

          <Modal
            animationType="slide"
            transparent={true}
            visible={isModalVisible}
            onRequestClose={closeModal}
          >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
                <>
                  <Text style={styles.heading}>{t('loanid')}: {loan}</Text>
                  <View style={styles.container}>
                    <View style={styles.headingRow}>
                      <Text style={[styles.headingText, { width: 80 }]}>{t('amount')}</Text>
                      <Text style={[styles.headingText, { width: 80 }]}>{t('emidate')}</Text>
                      <Text style={[styles.headingText, { width: 120 }]}>{t('emipay')}</Text>
                    </View>
                  </View>
                  <FlatList
                    data={showEmi}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                      <View style={styles.container}>
                        <View style={styles.row}>
                          <Text style={[styles.rowText, { width: 80 }]}>₹{parseInt(item.amount)}</Text>
                          <Text style={[styles.rowText, { width: 100 }]}>{item['emi date'].split(" ")[0]}</Text>
                          <Text style={[styles.rowText, { width: 120, color: item['status'] === 'paid' ? '#10b981' : '#ef4444' }]}>
                            {item['status'] === 'paid' ? t('paid') : item['status'] === 'unpaid' ? t('unpaid') : t('bounced')}
                          </Text>
                        </View>
                      </View>
                    )}
                  />
                </>
              <TouchableOpacity onPress={closeModal} style={styles.close}>
                <Icon name="times-circle" size={36} color="#000000" />
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
    FormContainer:{
        backgroundColor:'#ffffff',
        marginHorizontal:22,
        marginVertical:10,
        borderRadius:8,
        padding:24,
        elevation:8,
    },
    Container:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        marginBottom:16
    },
    InnerContainer:{
        flexDirection:'row'
    },
    container:{
      borderWidth:width*0.0019,
      borderColor:"#d5d5d5",
      marginHorizontal:width*0.03,
  },
  headingRow:{
      flexDirection:'row',
      backgroundColor:'#e8e8e8',
      padding:width*0.03,
      height:height*0.1,
      display:'flex',
      alignItems:'center'
  },
  headingText:{
      fontSize:width*0.038,
      color:'#000000',
      fontWeight:'500',
      textAlign:'center',
      marginHorizontal:width*0.03
  },
  row:{
      flexDirection:'row',
      padding:width*0.03,
      height:height*0.09,
      display:'flex',
      alignItems:'center',
      borderBottomWidth:1,
      borderBottomColor:'#d5d5d5'
  },
  rowText:{
      fontSize:width*0.035,
      color:'#222222',
      textAlign:'center',
      marginHorizontal:width*0.026,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 8,
    elevation: 8,
    marginTop:width*0.25,
  },
  heading:{
    fontSize:width*0.06,
    color:'#000000',
    marginTop:width*0.05,
    marginHorizontal:width*0.03,
    fontWeight:'600',
    marginBottom:width*0.04,
    textAlign:'center'
},
close:{
  display:'flex',
  alignItems:'center'
}
});
