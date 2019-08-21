package app.eCmr;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.InputStreamReader;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import org.apache.log4j.Logger;
import app.common.SystemPath;

import app.common.LoggableStatement;
import com.ecams.common.dbconn.ConnectionContext;
import com.ecams.common.dbconn.ConnectionResource;
import com.ecams.common.logger.EcamsLogger;

public class Cmr5200 {

	Logger ecamsLogger  = EcamsLogger.getLoggerInstance();
	public static final String UTF8_BOM = "\uFEFF";

	//public Object[] getDiffAry(String UserID,String ItemID1,String ver1,String ItemID2,String ver2) throws Exception {
	public Object[] getDiffAry(HashMap<String, String> etcData) throws Exception {
		String			  tmpPath = "";
//		String			  strBinPath = "";
		ArrayList<HashMap<String, String>>   rtList = new ArrayList<HashMap<String, String>>();
		HashMap<String, String>			  rst		  = null;
		String  shFileName = "";
		String	fileName = "";
		String	fileName1 = "";
		String	fileName2 = "";

		String readline1 = "";
		String readline2 = "";
		String strParm = "";
		BufferedReader in1  = null;
		BufferedReader in2  = null;
		File outFile1 = null;
		File outFile2 = null;
		int	linecnt;
		int ret;

		try {
			tmpPath = etcData.get("tmpdir");
			shFileName = etcData.get("userid") + "_" + etcData.get("itemid") +"_cmpsrc.sh";
			fileName = etcData.get("userid") + "_" + etcData.get("itemid");
			fileName1 = tmpPath + "/" + fileName + ".1";
			fileName2 = tmpPath + "/" + fileName + ".2";
			outFile1 = new File(fileName1);
			outFile2 = new File(fileName1);
			outFile1.delete();
			outFile2.delete();
			
			//fileName1 = "F:\\Azsoft\\HTML5\\save\\MASTER000000326526.1";
			//fileName2 = "F:\\Azsoft\\HTML5\\save\\MASTER000000326526.2";
			
			Cmr0200 cmr0200 = new Cmr0200();
			strParm = "./ecams_cmpsrc CMPSRC " + etcData.get("itemid") + " " + etcData.get("diffgbn1") + " " + etcData.get("befver") + " " + etcData.get("itemid") + " " + etcData.get("diffgbn2") + " " + etcData.get("aftver") + " " + fileName;
			ret = cmr0200.execShell(shFileName, strParm, false);
			cmr0200 = null;
			if (ret != 0) {
				rst = new HashMap<String, String>();
				rst.put("error","Y");
				rst.put("errmsg","소스비교 실패. run=["+strParm +"]" + " return=[" + ret + "]");
				rtList.add(rst);
				rst = null;
			} else if (!outFile1.exists() || !outFile2.exists()) {
				rst = new HashMap<String, String>();
				rst.put("error","Y");
				rst.put("errmsg","소스비교결과 없음. ["+fileName1 +"] [" + fileName2 + "]");
				rtList.add(rst);
				rst = null;
			} else {			
				in1 = new BufferedReader(new InputStreamReader(new FileInputStream(fileName1),"MS949"));
				in2 = new BufferedReader(new InputStreamReader(new FileInputStream(fileName2),"MS949"));
	
				rtList.clear();
				linecnt = 1;
				while( ((readline1 = in1.readLine()) != null ) && ((readline2 = in2.readLine()) != null ))
				{
					rst = new HashMap<String, String>();
					rst.put("lineno",Integer.toString(linecnt));
					rst.put("error","N");
					if (readline1 != null){
						if (readline1.substring(0, 2).equals("D ")){
							rst.put("file1diff",readline1.substring(0, 2));
							rst.put("file1", readline1.substring(2));
						}
						else if (readline1.substring(0, 2).equals("I ")){
							rst.put("file1diff",readline1.substring(0, 2));
							rst.put("file1", readline1.substring(2));
						}
						else if (readline1.substring(0, 2).equals("RO")){
							rst.put("file1diff",readline1.substring(0, 2));
							rst.put("file1", readline1.substring(2));
						}
						else if (readline1.substring(0, 2).equals("RN")){
							rst.put("file1diff",readline1.substring(0, 2));
							rst.put("file1", readline1.substring(2));
						}
						else{
							rst.put("file1diff","");
							rst.put("file1", readline1);
						}
						//ecamsLogger.error("11111111111111"+readline1);
					}
					if (readline2 != null){
						if (readline2.substring(0, 2).equals("D ")){
							rst.put("file2diff",readline2.substring(0, 2));
							rst.put("file2", readline2.substring(2));
						}
						else if (readline2.substring(0, 2).equals("I ")){
							rst.put("file2diff",readline2.substring(0, 2));
							rst.put("file2", readline2.substring(2));
						}
						else if (readline2.substring(0, 2).equals("RO")){
							rst.put("file2diff",readline2.substring(0, 2));
							rst.put("file2", readline2.substring(2));
						}
						else if (readline2.substring(0, 2).equals("RN")){
							rst.put("file2diff",readline2.substring(0, 2));
							rst.put("file2", readline2.substring(2));
						}
						else{
							rst.put("file2diff","");
							rst.put("file2", readline2);
						}
						//ecamsLogger.error("22222222222222"+readline2);
					}
					rtList.add(rst);
					rst = null;
					linecnt++;
				}
				in1.close();
				in2.close();
				in1 = null;
				in2 = null;
				
				outFile1.delete();
				outFile2.delete();				
			}
			
			outFile1 = null;
			outFile2 = null;
			ecamsLogger.error(rtList.toString());
			
			return rtList.toArray();

		} catch (Exception exception) {
			exception.printStackTrace();
			ecamsLogger.error("## Cmr5200.getDiffAry() Exception START ##");
			ecamsLogger.error("## Error DESC : ", exception);
			ecamsLogger.error("## Cmr5300.getDiffAry() Exception END ##");
			throw exception;
		}finally{
			if (outFile1 != null) outFile1.delete();outFile1 = null;
			if (outFile2 != null) outFile2.delete();outFile2 = null;
			if (rtList != null)	rtList = null;
			//fileStr = fileStream.toString("EUC-KR");
		}
	}
	public Object[] getSvrList(String sysCd,String rsrcCd) throws SQLException, Exception {
		Connection        conn        = null;
		PreparedStatement pstmt       = null;
		ResultSet         rs          = null;
		StringBuffer      strQuery    = new StringBuffer();
//		Object[]		  rtObj		  = null;
		ArrayList<HashMap<String, String>>		  rtList	  = new ArrayList<HashMap<String, String>>();
		HashMap<String, String>			  rst		  = null;
		ConnectionContext connectionContext = new ConnectionResource();

		try {
			conn = connectionContext.getConnection();

			strQuery.setLength(0);
			strQuery.append("select a.cm_svrcd,a.cm_seqno,a.cm_svrname,c.cm_codename \n");
			strQuery.append("from cmm0031 a,cmm0038 b,cmm0020 c \n");
			strQuery.append("where a.cm_syscd= ? \n");
			strQuery.append("and a.cm_closedt is null and a.cm_cmpsvr='Y' \n");
			strQuery.append("and a.cm_syscd=b.cm_syscd and a.cm_svrcd=b.cm_svrcd \n");
			strQuery.append("and a.cm_seqno=b.cm_seqno \n");
			strQuery.append("and b.cm_rsrccd= ? \n");
			strQuery.append("and c.cm_macode='SERVERCD' and c.cm_micode=a.cm_svrcd \n");
			strQuery.append("order by a.cm_svrcd \n");
            pstmt = conn.prepareStatement(strQuery.toString());
			//pstmt =  new LoggableStatement(conn, strQuery.toString());
            pstmt.setString(1, sysCd);
            pstmt.setString(2, rsrcCd);
            rs = pstmt.executeQuery();

			rst = new HashMap<String,String>();
			rst.put("cm_svrcd", "00");
			rst.put("cm_seqno", "00");
			rst.put("cm_svrname", "00");
			rst.put("cm_codename","00");
			rst.put("combolabel", "선택하세요.");
			rtList.add(rst);
			rst = null;

			while (rs.next()){
				rst = new HashMap<String,String>();
				rst.put("cm_svrcd", rs.getString("cm_svrcd"));
				rst.put("cm_seqno", rs.getString("cm_seqno"));
				rst.put("cm_svrname", rs.getString("cm_svrname"));
				rst.put("cm_codename",rs.getString("cm_codename"));
				rst.put("combolabel", rs.getString("cm_svrname")+"["+rs.getString("cm_codename")+"]");
				rtList.add(rst);
				rst = null;
			}
			rs.close();
			pstmt.close();
			conn.close();
			rs = null;
			pstmt = null;
			conn = null;

			return rtList.toArray();

			//end of while-loop statement

		} catch (SQLException sqlexception) {
			sqlexception.printStackTrace();
			ecamsLogger.error("## Cmr5200.getSvrList() SQLException START ##");
			ecamsLogger.error("## Error DESC : ", sqlexception);
			ecamsLogger.error("## Cmr5200.getSvrList() SQLException END ##");
			throw sqlexception;
		} catch (Exception exception) {
			exception.printStackTrace();
			ecamsLogger.error("## Cmr5200.getSvrList() Exception START ##");
			ecamsLogger.error("## Error DESC : ", exception);
			ecamsLogger.error("## Cmr5200.getSvrList() Exception END ##");
			throw exception;
		}finally{
			if (strQuery != null) 	strQuery = null;
			if (rtList != null)	rtList = null;
			if (rs != null)     try{rs.close();}catch (Exception ex){ex.printStackTrace();}
			if (pstmt != null)  try{pstmt.close();}catch (Exception ex2){ex2.printStackTrace();}
			if (conn != null){
				try{
					ConnectionResource.release(conn);
				}catch(Exception ex3){
					ecamsLogger.error("## Cmr5200.getSvrList() connection release exception ##");
					ex3.printStackTrace();
				}
			}
		}

	}

	public String getCheckInAcptNo(String ItemID) throws SQLException, Exception {
		Connection        conn        = null;
		PreparedStatement pstmt       = null;
		ResultSet         rs          = null;
		StringBuffer      strQuery    = new StringBuffer();
		ConnectionContext connectionContext = new ConnectionResource();
		String			  rtString    = "";

		try {
			conn = connectionContext.getConnection();

			strQuery.setLength(0);
			strQuery.append("select max(a.cr_acptno) cr_acptno       \n");
			strQuery.append("from cmr0027 a, cmr0020 b               \n");
			strQuery.append("where a.cr_itemid= ?                    \n");
			strQuery.append("and  a.cr_itemid= b.cr_itemid           \n");
			strQuery.append("and ((b.cr_status='7' and substr(a.cr_acptno,5,2)='04') or        \n");
			strQuery.append("     (b.cr_status in ('A','B') and substr(a.cr_acptno,5,2)='03')) \n");

            pstmt = conn.prepareStatement(strQuery.toString());
            pstmt.setString(1, ItemID);
            rs = pstmt.executeQuery();
			if (rs.next()){
				rtString = rs.getString("cr_acptno");
			}
			rs.close();
			pstmt.close();
			conn.close();
			rs = null;
			pstmt = null;
			conn = null;


			return rtString;
			//end of while-loop statement


		} catch (SQLException sqlexception) {
			sqlexception.printStackTrace();
			ecamsLogger.error("## Cmr5200.getCheckInAcptNo() SQLException START ##");
			ecamsLogger.error("## Error DESC : ", sqlexception);
			ecamsLogger.error("## Cmr5200.getCheckInAcptNo() SQLException END ##");
			throw sqlexception;
		} catch (Exception exception) {
			exception.printStackTrace();
			ecamsLogger.error("## Cmr5200.getCheckInAcptNo() Exception START ##");
			ecamsLogger.error("## Error DESC : ", exception);
			ecamsLogger.error("## Cmr5200.getCheckInAcptNo() Exception END ##");
			throw exception;
		}finally{
			if (strQuery != null) 	strQuery = null;
			if (rs != null)     try{rs.close();}catch (Exception ex){ex.printStackTrace();}
			if (pstmt != null)  try{pstmt.close();}catch (Exception ex2){ex2.printStackTrace();}
			if (conn != null){
				try{
					ConnectionResource.release(conn);
				}catch(Exception ex3){
					ecamsLogger.error("## Cmr5200.getCheckInAcptNo() connection release exception ##");
					ex3.printStackTrace();
				}
			}
		}
	}

}
