import { StyleSheet, Text, View,Modal,FlatList,Dimensions,TouchableOpacity } from 'react-native'
import React,{useEffect,useState} from 'react'
import { useTranslation } from 'react-i18next';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useAuth } from '../pages/AuthContext';
import axios from 'axios';
import { useNavigation,useRoute } from '@react-navigation/native';


const { width, height } = Dimensions.get('window');

export default function EMIDetails({mobileNumber,loanid}) {
    // const { mobileNumber,loanid } = route.params;
    const {t} =useTranslation();
    const [loading, setLoading] = useState(true);
    const [loading1, setLoading1] = useState(true);
    const [emiData, setEmiData] = useState([]);
    const [showEmi,setShowEmi] = useState([]);
    const [loan, setLoan] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const { state, handleLogout } = useAuth();
    const navigation = useNavigation();

    const api="https://pnf-backend.vercel.app/"

    useEffect(()=>{
        fetchEmiData(mobileNumber);
    },[])
    useEffect(()=>{
        if(!loading){
            handleClick();
        }
    },[loading,loanid]);
    const closeModal = () => {
        navigation.navigate('MyLoan',{mobileNumber})
        setIsModalVisible(false);
    }
    const fetchEmiData = async (mobileNumber)=>{
        // console.log("mobileNumber",mobileNumber)
        const modifiedMobileNumber = mobileNumber.length > 10 ? mobileNumber.slice(-10):mobileNumber;
        //console.log("Mobile number Loan",modifiedMobileNumber);
        try{
          // setLoading1(true);
          let url=`${api}/emi?criteria=sheet_26521917.column_35.column_87%20LIKE%20%22%25${encodeURIComponent(modifiedMobileNumber)}%22`;
          const res = await axios.get(url);
          // Group emiData by loan ID
            const groupedEmiData = res.data.data.reduce((acc, emi) => {
                const loanId = emi['loan id'];
                if (!acc[loanId]) {
                acc[loanId] = [];
                }
                acc[loanId].push(emi);
                return acc;
            }, {});
          setEmiData(groupedEmiData);
          setLoading(false);
          // console.log(res.data.data);
          // console.log(groupedEmiData);
        }catch(err){
          console.error('Error fetching data in emiDetails: ',err.message);
        }
      }
    //   useEffect(()=>{
    //         handleClick();
    //   },[])
    const handleClick=() =>{
        // navigation.navigate('Dash')
            const initialShowEmi = emiData[loanid] || [];
            // setLoading1(true);
            setShowEmi(initialShowEmi);
            // setShowEmi(emiData[id1])
            setLoan(loanid)
            // console.log(id1);
            setIsModalVisible(true);
            setLoading1(false);
      }
  return (
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
  )
}

const styles = StyleSheet.create({
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
})