/*****************************************************************************************
	1. program ID	: Cmp1500.java
	2. create date	: 2012. 01. 02
	3. auth		    : no name
	4. update date	:
	5. auth		    :
	6. description	: ����1->��������
*****************************************************************************************/

package app.eCmp;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
//import java.util.Date;
import java.util.HashMap;
//import java.util.Locale;

//import org.apache.commons.lang.time.FastDateFormat;
import org.apache.log4j.Logger;

//import app.common.LoggableStatement;

import com.ecams.common.dbconn.ConnectionContext;
import com.ecams.common.dbconn.ConnectionResource;
import com.ecams.common.logger.EcamsLogger;

/**
 * @author UBIQUITOUS
 *
 */
public class Cmp1500 {

	Logger ecamsLogger  = EcamsLogger.getLoggerInstance();

	/** ����1->�������� ��ȸ ����
	 * @param Sdate ��Ƚ������� 20120101
	 * @param Edate ����������� 20120101
	 * @param SearchWord �˻���
	 * @param cboGubun �Ϸᱸ�� 0:��ü 1:������ 2:�Ϸ�
	 * @return
	 * @throws SQLException
	 * @throws Exception
	 */
	public Object[] getList(String Sdate,String Edate,String SearchWord,String cboGubun) throws SQLException, Exception {
		Connection        conn        = null;
		PreparedStatement pstmt       = null;
		ResultSet         rs          = null;
		PreparedStatement pstmt2      = null;
		ResultSet         rs2         = null;
		StringBuffer      strQuery    = new StringBuffer();
		int               parmCnt     = 0;

		ArrayList<HashMap<String, String>>  rsval = new ArrayList<HashMap<String, String>>();
		HashMap<String, String>			  rst		  = null;
		ConnectionContext connectionContext = new ConnectionResource();

		try {

			conn = connectionContext.getConnection();
			strQuery.setLength(0);

			strQuery.append("select REQDT,TIT,DOCNO,REQMN,DDAGMN,TSTDEFYN,TSTPSBDT,TSTRSLTDT,DVLPTERM, \n");
			strQuery.append("       ENDDEFYN,ENDFRCTDT,ENDDT,decode(DEFRSNDVLP,null,'���Է�','�Է¿Ϸ�') DEFRSNDVLP_VIEW,PRCGB, \n");
			strQuery.append("       ILJAGYESAN(TSTPSBDT,TSTRSLTDT) TSTDEFDAY,DEFCNTEDVLP1,DEFCNTEDVLP2,DEFCNTEDVLP3, \n");
			strQuery.append("       ILJAGYESAN(ENDFRCTDT,ENDDT) ENDDEFDAY,nvl(DEFRSNDVLP,'') DEFRSNDVLP \n");
			strQuery.append("from KPCOMPRCREQDOC \n");
			strQuery.append("where REQDT BETWEEN ? AND ? \n");//�������
			strQuery.append("  AND (TSTDEFYN = 'Y' OR ENDDEFYN = 'Y') \n");
	        if (cboGubun.equals("1")){//������
	        	strQuery.append("  AND (TRIM(NVL(ENDDT,''))  = '' OR TRIM(NVL(ENDDT,'')) IS     NULL) \n");
	        } else if (cboGubun.equals("2")){//�Ϸ�
	        	strQuery.append("  AND (TRIM(NVL(ENDDT,'')) != '' OR TRIM(NVL(ENDDT,'')) IS NOT NULL) \n");
	        }
	        if (SearchWord != null && SearchWord != "") {
	        	strQuery.append("   AND  (   REQDT      LIKE ? \n");
	        	strQuery.append("         OR DOCNO      LIKE ? \n");
	        	strQuery.append("         OR TIT        LIKE ? \n");
	        	strQuery.append("         OR REQMN      LIKE ? \n");
	        	strQuery.append("         OR DDAGMN     LIKE ? \n");
	        	strQuery.append("        ) \n");
	        }
	        strQuery.append("order by ENDFRCTDT DESC, REQDT DESC \n");

	        pstmt = conn.prepareStatement(strQuery.toString());
			//pstmt = new LoggableStatement(conn,strQuery.toString());

	        pstmt.setString(++parmCnt, Sdate);
	        pstmt.setString(++parmCnt, Edate);
			if(SearchWord != null && SearchWord != ""){
		        pstmt.setString(++parmCnt, "%"+SearchWord+"%");
		        pstmt.setString(++parmCnt, "%"+SearchWord+"%");
		        pstmt.setString(++parmCnt, "%"+SearchWord+"%");
		        pstmt.setString(++parmCnt, "%"+SearchWord+"%");
		        pstmt.setString(++parmCnt, "%"+SearchWord+"%");
			}
			//ecamsLogger.error(((LoggableStatement)pstmt).getQueryString());
	        rs = pstmt.executeQuery();
	        rsval.clear();

			while (rs.next()){
//				if (rs.getString("TSTDEFYN").equals("Y") || rs.getString("PRCGB").equals("���α׷�����")){
//	                if(rs.getString("TSTRSLTDT").equals("X")){
//		                if(rs.getString("TSTPSBDT").equals("X")){
//		                }else if(Integer.parseInt(rs.getString("TSTPSBDT")) < Integer.parseInt(rs.getString("sysdt"))){
//		                	delayTest = Holiday_Check.WorkDayAccount(rs.getString("TSTPSBDT").trim());
//		                }
//	                }else{
//	                	if(Integer.parseInt(rs.getString("TSTRSLTDT")) > Integer.parseInt(rs.getString("TSTPSBDT"))){
//		                	delayTest = Holiday_Check.WorkDayAccount(rs.getString("TSTPSBDT").trim());
//	                	}
//	                }
//				}
//				if (rs.getString("ENDDEFYN").equals("Y") || rs.getString("PRCGB").equals("���α׷�����")){
//	                if(rs.getString("ENDDT").equals("X")){
//		                if(rs.getString("ENDFRCTDT").equals("X")){
//		                }else if(Integer.parseInt(rs.getString("ENDFRCTDT")) < Integer.parseInt(rs.getString("sysdt"))){
//		                	delayEnd = Holiday_Check.WorkDayAccount(rs.getString("ENDFRCTDT").trim());
//		                }
//	                }else{
//	                	if(Integer.parseInt(rs.getString("ENDDT")) > Integer.parseInt(rs.getString("ENDFRCTDT"))){
//	                		delayEnd = Holiday_Check.WorkDayAccount(rs.getString("ENDFRCTDT").trim());
//	                	}
//	                }
//				}
				rst = new HashMap<String, String>();
        		rst.put("ENDFRCTDT",   rs.getString("ENDFRCTDT").substring(0,4)+"-"+rs.getString("ENDFRCTDT").substring(4,6)+"-"+rs.getString("ENDFRCTDT").substring(6));  //�ϷΌ����
        		rst.put("REQDT",       rs.getString("REQDT").substring(0,4)+"-"+rs.getString("REQDT").substring(4,6)+"-"+rs.getString("REQDT").substring(6));//�������
        		rst.put("TIT",         rs.getString("TIT"));        //����
        		rst.put("DOCNO",       rs.getString("DOCNO"));      //������ȣ
        		rst.put("REQMN",       rs.getString("REQMN"));      //�����
        		rst.put("DDAGMN",      rs.getString("DDAGMN"));     //������
        		rst.put("TSTDEFYN",    rs.getString("TSTDEFYN"));   //�׽�Ʈ��������
        		if (rs.getString("TSTPSBDT") != null) rst.put("TSTPSBDT",rs.getString("TSTPSBDT"));   //�׽�Ʈ������
        		else rst.put("TSTPSBDT","");
        		if (rs.getString("TSTRSLTDT") != null) rst.put("TSTRSLTDT",   rs.getString("TSTRSLTDT"));  //�׽�Ʈ������
        		else rst.put("TSTRSLTDT","���ۼ�");
        		rst.put("ENDDEFYN",rs.getString("ENDDEFYN"));   //�Ϸ���������
        		//rst.put("ENDFRCTDT",rs.getString("ENDFRCTDT"));  //�ϷΌ����
        		if (rs.getString("ENDDT") != null){
        			rst.put("ENDDT",rs.getString("ENDDT").substring(0,4)+"-"+rs.getString("ENDDT").substring(4,6)+"-"+rs.getString("ENDDT").substring(6));//�Ϸ���
        		}else rst.put("ENDDT",       "");//�Ϸ���
        		if (rs.getString("DEFRSNDVLP") != null) rst.put("DEFRSNDVLP",  rs.getString("DEFRSNDVLP")); //��������
        		else rst.put("DEFRSNDVLP","");
        		rst.put("DEFRSNDVLP_VIEW",rs.getString("DEFRSNDVLP_VIEW")); //���Է� or �Է¿Ϸ�
        		rst.put("PRCGB",rs.getString("PRCGB"));      //ó������
        		if (rs.getString("DVLPTERM") != null) rst.put("DVLPTERM",    rs.getString("DVLPTERM"));   //���߼ҿ�Ⱓ
        		else rst.put("DVLPTERM","");
        		rst.put("TSTDEFDAY",rs.getString("TSTDEFDAY")+"��");//�׽�Ʈ�����ϼ�
        		rst.put("ENDDEFDAY",rs.getString("ENDDEFDAY")+"��");//�Ϸ������ϼ�
        		if (rs.getString("DEFCNTEDVLP1") != null) rst.put("DEFCNTEDVLP1",rs.getString("DEFCNTEDVLP1"));//2.���þ��� ��������
        		else rst.put("DEFCNTEDVLP1","");
        		if (rs.getString("DEFCNTEDVLP2") != null) rst.put("DEFCNTEDVLP2",rs.getString("DEFCNTEDVLP2"));//7.���߿켱��������
        		else rst.put("DEFCNTEDVLP2","");
        		if (rs.getString("DEFCNTEDVLP3") != null) rst.put("DEFCNTEDVLP3",rs.getString("DEFCNTEDVLP3"));//9.��Ÿ
        		else rst.put("DEFCNTEDVLP3","");


        		strQuery.setLength(0);
        		strQuery.append("select cm_userid from cmm0040\n");
    			strQuery.append(" where cm_username = ? \n");
    	        pstmt2 = conn.prepareStatement(strQuery.toString());
    	        pstmt2.setString(1, rs.getString("DDAGMN"));
    	        rs2 = pstmt2.executeQuery();
    			if (rs2.next()){
            		rst.put("DDAGMN_ID",   rs2.getString("cm_userid"));  //������ID
    			}else{
            		rst.put("DDAGMN_ID",   "");  //������ID
    			}
				rsval.add(rst);
				rst = null;
				rs2.close();
    			pstmt2.close();
			}
			rs.close();
			pstmt.close();
			conn.close();
			rs = null;
			pstmt = null;
			conn = null;

			return rsval.toArray();

		} catch (SQLException sqlexception) {
			sqlexception.printStackTrace();
			ecamsLogger.error("## Cmp1500.getList() SQLException START ##");
			ecamsLogger.error("## Error DESC : ", sqlexception);
			ecamsLogger.error("## Cmp1500.getList() SQLException END ##");
			throw sqlexception;
		} catch (Exception exception) {
			exception.printStackTrace();
			ecamsLogger.error("## Cmp1500.getList() Exception START ##");
			ecamsLogger.error("## Error DESC : ", exception);
			ecamsLogger.error("## Cmp1500.getList() Exception END ##");
			throw exception;
		}finally{
			if (strQuery != null)	strQuery = null;
			if (rsval != null)	rsval = null;
			if (rs != null)     try{rs.close();}catch (Exception ex){ex.printStackTrace();}
			if (pstmt != null)  try{pstmt.close();}catch (Exception ex2){ex2.printStackTrace();}
			if (conn != null){
				try{
					ConnectionResource.release(conn);
				}catch(Exception ex3){
					ecamsLogger.error("## Cmp1500.getList() connection release exception ##");
					ex3.printStackTrace();
				}
			}
		}
	}//end of getList() method statement

	public String setDelayInfo(HashMap<String,String> DelayInfo) throws SQLException, Exception {
		Connection        conn        = null;
		PreparedStatement pstmt       = null;
		StringBuffer      strQuery    = new StringBuffer();
		ConnectionContext connectionContext = new ConnectionResource();

		try {
			conn = connectionContext.getConnection();
			conn.setAutoCommit(false);

        	strQuery.setLength(0);
    		strQuery.append("UPDATE KPCOMPRCREQDOC \n");
    		strQuery.append("   SET DEFRSNDVLP = ?, \n");
    		strQuery.append("       DefCnteDvlp1 = ?, \n");
    		strQuery.append("       DefCnteDvlp2 = ?, \n");
    		strQuery.append("       DefCnteDvlp3 = ? \n");
    		strQuery.append(" WHERE DOCNO = ? \n");
    		strQuery.append("   AND REQDT = ? \n");

    		pstmt = conn.prepareStatement(strQuery.toString());
    		//pstmt = new LoggableStatement(conn,strQuery.toString());
    		pstmt.setString(1, DelayInfo.get("DEFRSNDVLP"));
    		pstmt.setString(2, DelayInfo.get("DEFCNTEDVLP1"));
    		pstmt.setString(3, DelayInfo.get("DEFCNTEDVLP2"));
    		pstmt.setString(4, DelayInfo.get("DEFCNTEDVLP3"));
    		pstmt.setString(5, DelayInfo.get("DOCNO"));
    		pstmt.setString(6, DelayInfo.get("REQDT").replace("-", ""));
    		//ecamsLogger.error(((LoggableStatement)pstmt).getQueryString());
    		pstmt.executeUpdate();
    		pstmt.close();
            pstmt = null;

            conn.commit();
            conn.close();
            conn = null;

            return "1";

		} catch (SQLException sqlexception) {
			sqlexception.printStackTrace();
			ecamsLogger.error("## Cmp1500.setDelayInfo() SQLException START ##");
			ecamsLogger.error("## Error DESC : ", sqlexception);
			ecamsLogger.error("## Cmp1500.setDelayInfo() SQLException END ##");
			if (conn != null){
				try{
					conn.rollback();
					ConnectionResource.release(conn);
					conn = null;
				}catch(Exception ex3){
					ecamsLogger.error("## Cmp1500.setDelayInfo() connection release exception ##");
					ex3.printStackTrace();
				}
			}
			throw sqlexception;
		} catch (Exception exception) {
			exception.printStackTrace();
			ecamsLogger.error("## Cmp1500.setDelayInfo() Exception START ##");
			ecamsLogger.error("## Error DESC : ", exception);
			ecamsLogger.error("## Cmp1500.setDelayInfo() Exception END ##");
			if (conn != null){
				try{
					conn.rollback();
					ConnectionResource.release(conn);
					conn = null;
				}catch(Exception ex3){
					ecamsLogger.error("## Cmp1500.setDelayInfo() connection release exception ##");
					ex3.printStackTrace();
				}
			}
			throw exception;
		}finally{
			if (strQuery != null)	strQuery = null;
			if (pstmt != null)  try{pstmt.close();}catch (Exception ex2){ex2.printStackTrace();}
			if (conn != null){
				try{
					ConnectionResource.release(conn);
				}catch(Exception ex3){
					ecamsLogger.error("## Cmp1500.setDelayInfo() connection release exception ##");
					ex3.printStackTrace();
				}
			}
		}
	}//end of setDelayInfo() method statement


	public Object[] getList_back(String Sdate,String Edate,String SearchWord,String cboGubun) throws SQLException, Exception {
		Connection        conn        = null;
		PreparedStatement pstmt       = null;
		ResultSet         rs          = null;
		PreparedStatement pstmt2      = null;
		ResultSet         rs2         = null;
		StringBuffer      strQuery    = new StringBuffer();
		int               parmCnt     = 0;
//		String            formatString= "yyyyMMdd";

		ArrayList<HashMap<String, String>>  rsval = new ArrayList<HashMap<String, String>>();
		HashMap<String, String>			  rst		  = null;
		ConnectionContext connectionContext = new ConnectionResource();

		try {

			conn = connectionContext.getConnection();

			strQuery.setLength(0);
			strQuery.append("select REQDT,TIT,DOCNO,REQMN,DDAGMN,nvl(TSTDEFYN,'') TSTDEFYN,nvl(TSTPSBDT,'') TSTPSBDT,nvl(TSTRSLTDT,'') TSTRSLTDT,DVLPTERM, \n");
			strQuery.append("       nvl(ENDDEFYN,'') ENDDEFYN,nvl(ENDFRCTDT,'') ENDFRCTDT,nvl(ENDDT,'') ENDDT,decode(DEFRSNDVLP,null,'���Է�','�Է¿Ϸ�') DEFRSNDVLP_VIEW,PRCGB, \n");
			strQuery.append("       DEFCNTEDVLP1,DEFCNTEDVLP2,DEFCNTEDVLP3,nvl(DEFRSNDVLP,'') DEFRSNDVLP,TO_CHAR(SYSDATE,'YYYYMMDD') TODAY \n");
			strQuery.append("from KPCOMPRCREQDOC \n");
			strQuery.append("where REQDT BETWEEN ? AND ? \n");//�������
			strQuery.append("  AND (TSTDEFYN = 'Y' OR ENDDEFYN = 'Y') \n");
	        if (cboGubun.equals("1")){//������
	        	strQuery.append("  AND (TRIM(NVL(ENDDT,''))  = '' OR TRIM(NVL(ENDDT,'')) IS     NULL) \n");
	        } else if (cboGubun.equals("2")){//�Ϸ�
	        	strQuery.append("  AND (TRIM(NVL(ENDDT,'')) != '' OR TRIM(NVL(ENDDT,'')) IS NOT NULL) \n");
	        }
	        if (SearchWord != null && SearchWord != "") {
	        	strQuery.append("   AND  (   REQDT      LIKE ? \n");
	        	strQuery.append("         OR DOCNO      LIKE ? \n");
	        	strQuery.append("         OR TIT        LIKE ? \n");
	        	strQuery.append("         OR REQMN      LIKE ? \n");
	        	strQuery.append("         OR DDAGMN     LIKE ? \n");
	        	strQuery.append("        ) \n");
	        }
	        strQuery.append("order by ENDFRCTDT DESC, REQDT DESC \n");

	        pstmt = conn.prepareStatement(strQuery.toString());
			//pstmt = new LoggableStatement(conn,strQuery.toString());

	        pstmt.setString(++parmCnt, Sdate);
	        pstmt.setString(++parmCnt, Edate);
			if(SearchWord != null && SearchWord != ""){
		        pstmt.setString(++parmCnt, "%"+SearchWord+"%");
		        pstmt.setString(++parmCnt, "%"+SearchWord+"%");
		        pstmt.setString(++parmCnt, "%"+SearchWord+"%");
		        pstmt.setString(++parmCnt, "%"+SearchWord+"%");
		        pstmt.setString(++parmCnt, "%"+SearchWord+"%");
			}
			//ecamsLogger.error(((LoggableStatement)pstmt).getQueryString());
	        rs = pstmt.executeQuery();
	        rsval.clear();


			while (rs.next()){
				rst = new HashMap<String, String>();

        		//rst.put("TSTDEFDAY",rs.getString("TSTDEFDAY")+"��");//�׽�Ʈ�����ϼ�
                if (rs.getString("TSTDEFYN") != null && rs.getString("TSTDEFYN").equals("Y")){//�׽�Ʈ���� Y �϶�
                	if (rs.getString("TSTRSLTDT") == ""){//�׽�Ʈ������ۼ���   ���� ������
                		if (rs.getString("TSTPSBDT") == ""){//�����׽�Ʈ������  ���� ������
                			rst.put("TSTDEFDAY","���ۼ�");//�׽�Ʈ�����ϼ�
                		} else if (rs.getString("TSTPSBDT") != null && rs.getString("TSTPSBDT").trim() != "" &&
                				   NumberChk(rs.getString("TSTPSBDT")) &&
                				   Long.parseLong(rs.getString("TSTPSBDT")) < Long.parseLong(rs.getString("TODAY"))){
                				   //new SimpleDateFormat("yyyyMMdd").parse(rs.getString("TSTPSBDT")).getTime() < new SimpleDateFormat("yyyyMMdd").parse(rs.getString("TODAY")).getTime()){
                			//�����׽�Ʈ������ ��  ���� TODAY ������ ��
                			strQuery.setLength(0);
                			strQuery.append("select ILJAGYESAN(?,?) TSTDEFDAY from dual \n");
                	        pstmt2 = conn.prepareStatement(strQuery.toString());
                	        pstmt2.setString(1, rs.getString("TSTPSBDT"));
                	        pstmt2.setString(2, rs.getString("TODAY"));
                	        rs2 = pstmt2.executeQuery();
                	        if(rs2.next()){
                	        	if (rs2.getInt("TSTDEFDAY")>0){//����������
                	        		rst.put("TSTDEFDAY",rs2.getInt("TSTDEFDAY")+"��(���ۼ�)");//�׽�Ʈ�����ϼ�
                	        	}else{//���� �������� �ʾ�����
                	        		rst.put("TSTDEFDAY","���ۼ�");//�׽�Ʈ�����ϼ�
                	        	}
                	        } else{
                	        	rst.put("TSTDEFDAY","���ۼ�");//�׽�Ʈ�����ϼ�
                	        }
                	        rs2.close();
	            	        pstmt2.close();
                		} else{
                			rst.put("TSTDEFDAY","���ۼ�");//�׽�Ʈ�����ϼ�
                		}
                	} else if (rs.getString("TSTRSLTDT") != null && rs.getString("TSTRSLTDT").trim() != "" &&
                			   rs.getString("TSTPSBDT") != null && rs.getString("TSTPSBDT").trim() != "" &&
                			   NumberChk(rs.getString("TSTRSLTDT")) && NumberChk(rs.getString("TSTPSBDT")) &&
                			   Long.parseLong(rs.getString("TSTRSLTDT")) > Long.parseLong(rs.getString("TSTPSBDT"))){
                			   //new SimpleDateFormat("yyyyMMdd",Locale.ENGLISH).parse(rs.getString("TSTRSLTDT")).getTime() > new SimpleDateFormat("yyyyMMdd",Locale.ENGLISH).parse(rs.getString("TSTPSBDT")).getTime()){
	                    //�����׽�Ʈ������ ��  �׽�Ʈ������ۼ���  ������ ��
                		strQuery.setLength(0);
            			strQuery.append("select ILJAGYESAN(?,?) TSTDEFDAY from dual \n");
            	        pstmt2 = conn.prepareStatement(strQuery.toString());
            	        pstmt2.setString(1, rs.getString("TSTPSBDT"));
            	        pstmt2.setString(2, rs.getString("TSTRSLTDT"));
            	        rs2 = pstmt2.executeQuery();
            	        if(rs2.next()){
            	        	if (rs2.getInt("TSTDEFDAY")>0){//����������
            	        		rst.put("TSTDEFDAY",rs2.getInt("TSTDEFDAY")+"��");//�׽�Ʈ�����ϼ�
            	        	}else{//���� �������� �ʾ�����
            	        		rst.put("TSTDEFDAY","");//�׽�Ʈ�����ϼ�
            	        	}
            	        } else{
            	        	rst.put("TSTDEFDAY","");//�׽�Ʈ�����ϼ�
            	        }
            	        rs2.close();
            	        pstmt2.close();
                	} else{
                		rst.put("TSTDEFDAY","");//�׽�Ʈ�����ϼ�
                	}
	            } else {//�׽�Ʈ���� �ƴҶ� N
	            	rst.put("TSTDEFDAY","");//�׽�Ʈ�����ϼ�
	            }

	            //rst.put("ENDDEFDAY",rs.getString("ENDDEFDAY")+"��");//�Ϸ������ϼ�
	            if (rs.getString("ENDDEFYN") != null && rs.getString("ENDDEFYN").equals("Y")){//�Ϸ�����  Y �϶�
	            	if (rs.getString("ENDDT") == ""){//����ó���Ƿڼ�������   ���� ������
	            		if (rs.getString("ENDFRCTDT") == ""){//�ϷΌ����  ���� ������
	            			rst.put("ENDDEFDAY","");//�Ϸ������ϼ�
	            		} else if (rs.getString("ENDFRCTDT") != null && rs.getString("ENDFRCTDT").trim() != "" &&
	            				   NumberChk(rs.getString("ENDFRCTDT")) &&
	            				   Long.parseLong(rs.getString("ENDFRCTDT")) < Long.parseLong(rs.getString("TODAY"))){
	            				   //new SimpleDateFormat("yyyyMMdd").parse(rs.getString("ENDFRCTDT")).getTime() < new SimpleDateFormat("yyyyMMdd").parse(rs.getString("TODAY")).getTime()){
	            			//�ϷΌ���� ��  ���� TODAY ������ ��
	            			strQuery.setLength(0);
	            			strQuery.append("select ILJAGYESAN(?,?) ENDDEFDAY from dual \n");
	            	        pstmt2 = conn.prepareStatement(strQuery.toString());
	            	        pstmt2.setString(1, rs.getString("ENDFRCTDT"));
	            	        pstmt2.setString(2, rs.getString("TODAY"));
	            	        rs2 = pstmt2.executeQuery();
	            	        if(rs2.next()){
	            	        	if (rs2.getInt("ENDDEFDAY")>0){//����������
	            	        		rst.put("ENDDEFDAY",rs2.getInt("ENDDEFDAY")+"��");//�Ϸ������ϼ�
	            	        	}else{//���� �������� �ʾ�����
	            	        		rst.put("ENDDEFDAY","");//�Ϸ������ϼ�
	            	        	}
	            	        } else{
	            	        	rst.put("ENDDEFDAY","");//�Ϸ������ϼ�
	            	        }
	            	        rs2.close();
	            	        pstmt2.close();
	            		} else{
	            			rst.put("ENDDEFDAY","");//�Ϸ������ϼ�
	            		}
	            	} else if (rs.getString("ENDDT") != null && rs.getString("ENDDT").trim() != "" &&
	             			   rs.getString("ENDFRCTDT") != null && rs.getString("ENDFRCTDT").trim() != "" &&
	             			   NumberChk(rs.getString("ENDDT")) && NumberChk(rs.getString("ENDFRCTDT")) &&
	             			   Long.parseLong(rs.getString("ENDDT")) > Long.parseLong(rs.getString("ENDFRCTDT"))){
	             			   //new SimpleDateFormat("yyyyMMdd").parse(rs.getString("ENDDT")).getTime() > new SimpleDateFormat("yyyyMMdd").parse(rs.getString("ENDFRCTDT")).getTime()){
	                    //����ó���Ƿڼ�������  �� �ϷΌ���� ������ ��
	            		strQuery.setLength(0);
	        			strQuery.append("select ILJAGYESAN(?,?) ENDDEFDAY from dual \n");
	        	        pstmt2 = conn.prepareStatement(strQuery.toString());
	        	        pstmt2.setString(1, rs.getString("ENDFRCTDT"));
	        	        pstmt2.setString(2, rs.getString("ENDDT"));
	        	        rs2 = pstmt2.executeQuery();
	        	        if(rs2.next()){
	        	        	if (rs2.getInt("ENDDEFDAY")>0){//����������
	        	        		rst.put("ENDDEFDAY",rs2.getInt("ENDDEFDAY")+"��");//�Ϸ������ϼ�
	        	        	}else{//���� �������� �ʾ�����
	        	        		rst.put("ENDDEFDAY","");//�Ϸ������ϼ�
	        	        	}
	        	        } else{
	        	        	rst.put("ENDDEFDAY","");//�Ϸ������ϼ�
	        	        }
	        	        rs2.close();
            	        pstmt2.close();
	            	} else{
	            		rst.put("ENDDEFDAY","");//�Ϸ������ϼ�
	            	}
		        } else {//�׽�Ʈ���� �ƴҶ� N
		        	rst.put("ENDDEFDAY","");//�Ϸ������ϼ�
		        }

//				if (rs.getString("TSTDEFYN").equals("Y") || rs.getString("PRCGB").equals("���α׷�����")){
//	                if(rs.getString("TSTRSLTDT").equals("X")){
//		                if(rs.getString("TSTPSBDT").equals("X")){
//		                }else if(Integer.parseInt(rs.getString("TSTPSBDT")) < Integer.parseInt(rs.getString("sysdt"))){
//		                	delayTest = Holiday_Check.WorkDayAccount(rs.getString("TSTPSBDT").trim());
//		                }
//	                }else{
//	                	if(Integer.parseInt(rs.getString("TSTRSLTDT")) > Integer.parseInt(rs.getString("TSTPSBDT"))){
//		                	delayTest = Holiday_Check.WorkDayAccount(rs.getString("TSTPSBDT").trim());
//	                	}
//	                }
//				}
//				if (rs.getString("ENDDEFYN").equals("Y") || rs.getString("PRCGB").equals("���α׷�����")){
//	                if(rs.getString("ENDDT").equals("X")){
//		                if(rs.getString("ENDFRCTDT").equals("X")){
//		                }else if(Integer.parseInt(rs.getString("ENDFRCTDT")) < Integer.parseInt(rs.getString("sysdt"))){
//		                	delayEnd = Holiday_Check.WorkDayAccount(rs.getString("ENDFRCTDT").trim());
//		                }
//	                }else{
//	                	if(Integer.parseInt(rs.getString("ENDDT")) > Integer.parseInt(rs.getString("ENDFRCTDT"))){
//	                		delayEnd = Holiday_Check.WorkDayAccount(rs.getString("ENDFRCTDT").trim());
//	                	}
//	                }
//				}

        		rst.put("ENDFRCTDT",   rs.getString("ENDFRCTDT").substring(0,4)+"-"+rs.getString("ENDFRCTDT").substring(4,6)+"-"+rs.getString("ENDFRCTDT").substring(6));  //�ϷΌ����
        		rst.put("REQDT",       rs.getString("REQDT").substring(0,4)+"-"+rs.getString("REQDT").substring(4,6)+"-"+rs.getString("REQDT").substring(6));//�������
        		rst.put("TIT",         rs.getString("TIT"));        //����
        		rst.put("DOCNO",       rs.getString("DOCNO"));      //������ȣ
        		rst.put("REQMN",       rs.getString("REQMN"));      //�����
        		rst.put("DDAGMN",      rs.getString("DDAGMN"));     //������
        		rst.put("TSTDEFYN",    rs.getString("TSTDEFYN"));   //�׽�Ʈ��������
        		if (rs.getString("TSTPSBDT") != null && rs.getString("TSTPSBDT").trim() != "") rst.put("TSTPSBDT",rs.getString("TSTPSBDT"));   //�׽�Ʈ������
        		else rst.put("TSTPSBDT","");

        		if (rs.getString("TSTRSLTDT") != null && rs.getString("TSTRSLTDT").trim() != "") rst.put("TSTRSLTDT",rs.getString("TSTRSLTDT"));  //�׽�Ʈ������
        		else rst.put("TSTRSLTDT","���ۼ�");

        		rst.put("ENDDEFYN",rs.getString("ENDDEFYN"));   //�Ϸ���������
        		//rst.put("ENDFRCTDT",rs.getString("ENDFRCTDT"));  //�ϷΌ����

        		if (rs.getString("ENDDT") != null && rs.getString("ENDDT").trim() != ""){
        			rst.put("ENDDT",rs.getString("ENDDT").substring(0,4)+"-"+rs.getString("ENDDT").substring(4,6)+"-"+rs.getString("ENDDT").substring(6));//�Ϸ���
        		}else rst.put("ENDDT",       "");//�Ϸ���

        		if (rs.getString("DEFRSNDVLP") != null && rs.getString("DEFRSNDVLP").trim() != "") rst.put("DEFRSNDVLP",  rs.getString("DEFRSNDVLP")); //��������
        		else rst.put("DEFRSNDVLP","");

        		rst.put("DEFRSNDVLP_VIEW",rs.getString("DEFRSNDVLP_VIEW")); //���Է� or �Է¿Ϸ�
        		rst.put("PRCGB",rs.getString("PRCGB"));      //ó������

        		if (rs.getString("DVLPTERM") != null && rs.getString("DVLPTERM").trim() != "") rst.put("DVLPTERM",    rs.getString("DVLPTERM"));   //���߼ҿ�Ⱓ
        		else rst.put("DVLPTERM","");

        		if (rs.getString("DEFCNTEDVLP1") != null && rs.getString("DEFCNTEDVLP1").trim() != "") rst.put("DEFCNTEDVLP1",rs.getString("DEFCNTEDVLP1"));//2.���þ��� ��������
        		else rst.put("DEFCNTEDVLP1","");

        		if (rs.getString("DEFCNTEDVLP2") != null && rs.getString("DEFCNTEDVLP2").trim() != "") rst.put("DEFCNTEDVLP2",rs.getString("DEFCNTEDVLP2"));//7.���߿켱��������
        		else rst.put("DEFCNTEDVLP2","");

        		if (rs.getString("DEFCNTEDVLP3") != null  && rs.getString("DEFCNTEDVLP3").trim() != "") rst.put("DEFCNTEDVLP3",rs.getString("DEFCNTEDVLP3"));//9.��Ÿ
        		else rst.put("DEFCNTEDVLP3","");


        		strQuery.setLength(0);
        		strQuery.append("select cm_userid from cmm0040\n");
    			strQuery.append(" where cm_username = ? \n");
    	        pstmt2 = conn.prepareStatement(strQuery.toString());
    	        pstmt2.setString(1, rs.getString("DDAGMN"));
    	        rs2 = pstmt2.executeQuery();
    			if (rs2.next()){
            		rst.put("DDAGMN_ID",   rs2.getString("cm_userid"));  //������ID
    			}else{
            		rst.put("DDAGMN_ID",   "");  //������ID
    			}
				rsval.add(rst);
				rst = null;
				rs2.close();
    			pstmt2.close();
			}
			rs.close();
			pstmt.close();
			conn.close();
			rs = null;
			pstmt = null;
			conn = null;

			return rsval.toArray();

		} catch (SQLException sqlexception) {
			sqlexception.printStackTrace();
			ecamsLogger.error("## Cmp1500.getList() SQLException START ##");
			ecamsLogger.error("## Error DESC : ", sqlexception);
			ecamsLogger.error("## Cmp1500.getList() SQLException END ##");
			throw sqlexception;
		} catch (Exception exception) {
			exception.printStackTrace();
			ecamsLogger.error("## Cmp1500.getList() Exception START ##");
			ecamsLogger.error("## Error DESC : ", exception);
			ecamsLogger.error("## Cmp1500.getList() Exception END ##");
			throw exception;
		}finally{
			if (strQuery != null)	strQuery = null;
			if (rsval != null)	rsval = null;
			if (rs != null)     try{rs.close();}catch (Exception ex){ex.printStackTrace();}
			if (pstmt != null)  try{pstmt.close();}catch (Exception ex2){ex2.printStackTrace();}
			if (conn != null){
				try{
					ConnectionResource.release(conn);
				}catch(Exception ex3){
					ecamsLogger.error("## Cmp1500.getList() connection release exception ##");
					ex3.printStackTrace();
				}
			}
		}
	}//end of getList() method statement

	public boolean NumberChk(String str){
		char c;
		boolean retV = false;

		if(str.equals("")) return false;

		for(int i = 0 ; i < str.length() ; i++){
			c = str.charAt(i);
			if(c < 48 || c > 59){
				retV = false;
				break;
			}
		}
		return retV;
	}

	public String setDelayInfo_back(HashMap<String,String> DelayInfo) throws SQLException, Exception {
		Connection        conn        = null;
		PreparedStatement pstmt       = null;
		StringBuffer      strQuery    = new StringBuffer();
		ConnectionContext connectionContext = new ConnectionResource();

		try {
			conn = connectionContext.getConnection();
			conn.setAutoCommit(false);

        	strQuery.setLength(0);
    		strQuery.append("UPDATE KPCOMPRCREQDOC \n");
    		strQuery.append("   SET DEFRSNDVLP = ? \n");
    		if (DelayInfo.get("DEFRSNDVLP").indexOf("2") >= 0) strQuery.append("       ,DefCnteDvlp1 = ? \n");
    		if (DelayInfo.get("DEFRSNDVLP").indexOf("7") >= 0) strQuery.append("       ,DefCnteDvlp2 = ? \n");
    		if (DelayInfo.get("DEFRSNDVLP").indexOf("9") >= 0) strQuery.append("       ,DefCnteDvlp3 = ? \n");
    		strQuery.append(" WHERE DOCNO = ? \n");
    		strQuery.append("   AND REQDT = ? \n");

    		pstmt = conn.prepareStatement(strQuery.toString());
    		//pstmt = new LoggableStatement(conn,strQuery.toString());
    		int paramIndex = 0;
    		pstmt.setString(++paramIndex, DelayInfo.get("DEFRSNDVLP"));
    		if (DelayInfo.get("DEFRSNDVLP").indexOf("2") >= 0) pstmt.setString(++paramIndex, DelayInfo.get("DEFCNTEDVLP1"));
    		if (DelayInfo.get("DEFRSNDVLP").indexOf("7") >= 0) pstmt.setString(++paramIndex, DelayInfo.get("DEFCNTEDVLP2"));
    		if (DelayInfo.get("DEFRSNDVLP").indexOf("9") >= 0) pstmt.setString(++paramIndex, DelayInfo.get("DEFCNTEDVLP3"));
    		pstmt.setString(++paramIndex, DelayInfo.get("DOCNO"));
    		pstmt.setString(++paramIndex, DelayInfo.get("REQDT").replace("-", ""));
    		//ecamsLogger.error(((LoggableStatement)pstmt).getQueryString());
    		pstmt.executeUpdate();
    		pstmt.close();
            pstmt = null;

            conn.commit();
            conn.close();
            conn = null;

            return "1";

		} catch (SQLException sqlexception) {
			sqlexception.printStackTrace();
			ecamsLogger.error("## Cmp1500.setDelayInfo() SQLException START ##");
			ecamsLogger.error("## Error DESC : ", sqlexception);
			ecamsLogger.error("## Cmp1500.setDelayInfo() SQLException END ##");
			if (conn != null){
				try{
					conn.rollback();
					ConnectionResource.release(conn);
					conn = null;
				}catch(Exception ex3){
					ecamsLogger.error("## Cmp1500.setDelayInfo() connection release exception ##");
					ex3.printStackTrace();
				}
			}
			throw sqlexception;
		} catch (Exception exception) {
			exception.printStackTrace();
			ecamsLogger.error("## Cmp1500.setDelayInfo() Exception START ##");
			ecamsLogger.error("## Error DESC : ", exception);
			ecamsLogger.error("## Cmp1500.setDelayInfo() Exception END ##");
			if (conn != null){
				try{
					conn.rollback();
					ConnectionResource.release(conn);
					conn = null;
				}catch(Exception ex3){
					ecamsLogger.error("## Cmp1500.setDelayInfo() connection release exception ##");
					ex3.printStackTrace();
				}
			}
			throw exception;
		}finally{
			if (strQuery != null)	strQuery = null;
			if (pstmt != null)  try{pstmt.close();}catch (Exception ex2){ex2.printStackTrace();}
			if (conn != null){
				try{
					ConnectionResource.release(conn);
				}catch(Exception ex3){
					ecamsLogger.error("## Cmp1500.setDelayInfo() connection release exception ##");
					ex3.printStackTrace();
				}
			}
		}
	}//end of setDelayInfo() method statement

}//end of Cmp1500 class statement
