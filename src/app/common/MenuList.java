
/*****************************************************************************************
	1. program ID	: MenuList.java
	2. create date	: 2006.08. 08
	3. auth		    : teok.kang
	4. update date	: 
	5. auth		    : 
	6. description	: BBS DAO
*****************************************************************************************/

package app.common;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;

import org.apache.log4j.Logger;
import com.ecams.common.dbconn.ConnectionContext;
import com.ecams.common.dbconn.ConnectionResource;
import com.ecams.common.logger.EcamsLogger;
import org.w3c.dom.Document;
import app.common.CreateXml;




/**
 * @author bigeyes
 * TODO To change the template for this generated type comment go to
 * Window - Preferences - Java - Code Style - Code Templates
 */


public class MenuList{
	
    /**
     * Logger Class Instance Creation
     * logger
     */
    Logger ecamsLogger  = EcamsLogger.getLoggerInstance();
    
	/**
	 * 게시판을 조회합니다.(구분값을 주어)
	 * @param  gbn
	 * @return ArrayList
	 * @throws SQLException
	 * @throws Exception
	 */
	
    public Object[] SelectMenuList(String user_id) throws SQLException, Exception {
		Connection        conn        = null;
		PreparedStatement pstmt       = null;
		ResultSet         rs          = null;
		StringBuffer      strQuery    = new StringBuffer();
		CreateXml      ecmmtb      = new CreateXml();
		Object[] returnObjectArray = null;
		ArrayList<Document> list = new ArrayList<Document>();
		ConnectionContext connectionContext = new ConnectionResource();	
		
		
		try {			
			conn = connectionContext.getConnection();

            strQuery.append("SELECT DISTINCT B.CM_MENUCD   CM_MENUCD");
            strQuery.append(" , B.CM_MANAME   CM_MANAME");
            strQuery.append(" , B.CM_BEFMENU  CM_BEFMENU");
            strQuery.append(" , B.CM_FILENAME CM_FILENAME");
            strQuery.append(" , B.CM_ORDER    CM_ORDER");
            strQuery.append(" FROM CMM0080 B , CMM0090 A"); 
            strQuery.append(" WHERE A.CM_RGTCD IN(SELECT CM_RGTCD"); 
            strQuery.append(" FROM CMM0043 ");
            strQuery.append(" WHERE CM_USERID= ?)");   
            strQuery.append(" AND A.CM_MENUCD  = B.CM_MENUCD");
            strQuery.append(" AND B.CM_BEFMENU <> 999");
            strQuery.append(" ORDER BY  B.CM_BEFMENU, B.CM_ORDER, B.CM_MENUCD, B.CM_MANAME, B.CM_FILENAME");   	            
            
            
            pstmt = conn.prepareStatement(strQuery.toString());
            pstmt.setString(1, user_id);		
			
            rs = pstmt.executeQuery();	            
            
            ecmmtb.init_Xml("ID","cm_menucd","cm_maname","cm_befmenu","cm_filename","cm_order");
            
			while (rs.next()){
				ecmmtb.addXML(rs.getString("cm_menucd"),rs.getString("cm_menucd"),
						rs.getString("cm_maname"),rs.getString("cm_befmenu"),
						rs.getString("cm_filename"),rs.getString("cm_order"),
						rs.getString("cm_befmenu"));
			}//end of while-loop statement
			
			rs.close();
			pstmt.close();
			conn.close();
			
			rs = null;
			pstmt = null;
			conn = null;
			
			list.add(ecmmtb.getDocument());
			
			returnObjectArray = list.toArray();

			list = null;
			ecmmtb = null;
			//ecamsLogger.error(ecmmtb.xml_toStr());
			
			return returnObjectArray;			
						
			
		} catch (SQLException sqlexception) {
			sqlexception.printStackTrace();
			ecamsLogger.error("## MenuList.SelectMenuList() SQLException START ##");
			ecamsLogger.error("## Error DESC : ", sqlexception);	
			ecamsLogger.error("## MenuList.SelectMenuList() SQLException END ##");			
			throw sqlexception;
		} catch (Exception exception) {
			exception.printStackTrace();
			ecamsLogger.error("## MenuList.SelectMenuList() Exception START ##");				
			ecamsLogger.error("## Error DESC : ", exception);	
			ecamsLogger.error("## MenuList.SelectMenuList() Exception END ##");				
			throw exception;
		}finally{
			if (strQuery != null) 	strQuery = null;
			if (returnObjectArray != null)	returnObjectArray = null;
			if (rs != null)     try{rs.close();}catch (Exception ex){ex.printStackTrace();}
			if (pstmt != null)  try{pstmt.close();}catch (Exception ex2){ex2.printStackTrace();}
			if (conn != null){
				try{
					ConnectionResource.release(conn);
				}catch(Exception ex3){
					ecamsLogger.error("## MenuList.SelectMenuList() connection release exception ##");
					ex3.printStackTrace();
				}
			}
		}

		
	}//end of SelectMenuList() method statement	
/*
    public Object[] secuMenuList(String user_id) throws SQLException, Exception {
		Connection        conn        = null;
		PreparedStatement pstmt       = null;
		ResultSet         rs          = null;
		StringBuffer      strQuery    = new StringBuffer();
		Object[]		  rtObj		  = null;
		ConnectionContext connectionContext = new ConnectionResource();	
		HashMap<String, String>			    rst	   = null;
		ArrayList<HashMap<String, String>>  rtList = new ArrayList<HashMap<String, String>>();
		
		// 메뉴 순번 및 메뉴 이름 추가 변수 선언
		String tmpMenu = "";
		
		try {			
			conn = connectionContext.getConnection();

            strQuery.append("SELECT C.CM_ORDER    cm_order      \n");
            strQuery.append("      ,C.CM_MENUCD   cm_menucd     \n");
            strQuery.append("      ,C.CM_MANAME   cm_maname     \n");
            strQuery.append("      ,B.CM_ORDER    cm_order_sub  \n");
            strQuery.append("      ,B.CM_MENUCD   cm_menucd_sub \n");
            strQuery.append("      ,B.CM_MANAME   cm_maname_sub \n");
            strQuery.append("      ,B.CM_FILENAME cm_filename   \n");
            strQuery.append("      ,B.CM_REQCD    cm_reqcd      \n");
            strQuery.append("  FROM CMM0080 C,CMM0080 B ,CMM0090 A\n");
            strQuery.append(" WHERE A.CM_RGTCD IN(SELECT CM_RGTCD FROM CMM0043 \n");
            strQuery.append("                      WHERE CM_USERID= ?)         \n"); 
            strQuery.append("   AND A.CM_MENUCD=B.CM_MENUCD     \n");
            strQuery.append("   AND B.CM_BEFMENU<>0             \n");
            strQuery.append("   AND B.CM_MENUCD<>999            \n");
            strQuery.append("   AND B.CM_BEFMENU=C.CM_MENUCD    \n");
            strQuery.append(" GROUP BY C.CM_ORDER,C.CM_MENUCD,C.CM_MANAME,B.CM_ORDER,B.CM_MENUCD,B.CM_MANAME,B.CM_FILENAME,B.CM_REQCD  \n"); 	
            strQuery.append(" ORDER BY C.CM_ORDER,B.CM_ORDER    \n");            
            pstmt = conn.prepareStatement(strQuery.toString());
            pstmt.setString(1, user_id);			
            rs = pstmt.executeQuery();    
			while (rs.next()){
				if(!rs.getString("cm_maname").equals(tmpMenu)) {
					rst = new HashMap<String, String>();
					rst.put("id", rs.getString("cm_order"));
					rst.put("pid", "0");
					rst.put("order", rs.getString("cm_order"));
					rst.put("text", rs.getString("cm_maname"));	
					tmpMenu = rs.getString("cm_maname");
					rtList.add(rst);
					rst = null;
				}
				
				rst = new HashMap<String, String>();
				rst.put("id", rs.getString("cm_order") + "_" + rs.getString("cm_order_sub"));
				rst.put("pid", rs.getString("cm_order"));
				rst.put("order", rs.getString("cm_order_sub"));
				rst.put("text", rs.getString("cm_maname_sub"));
				rst.put("link", rs.getString("cm_filename"));	
				rtList.add(rst);
				rst = null;				
			}//end of while-loop statement
			rs.close();
			pstmt.close();
			conn.close();

        	rs = null;
            pstmt = null;
            conn = null;
            
            rtObj =  rtList.toArray();

			rtList = null;

			return rtObj;			
		} catch (SQLException sqlexception) {
			sqlexception.printStackTrace();
			ecamsLogger.error("## MenuList.secuMenuList() SQLException START ##");
			ecamsLogger.error("## Error DESC : ", sqlexception);	
			ecamsLogger.error("## MenuList.secuMenuList() SQLException END ##");			
			throw sqlexception;
		} catch (Exception exception) {
			exception.printStackTrace();
			ecamsLogger.error("## MenuList.secuMenuList() Exception START ##");				
			ecamsLogger.error("## Error DESC : ", exception);	
			ecamsLogger.error("## MenuList.secuMenuList() Exception END ##");				
			throw exception;
		}finally{
			if (strQuery != null) 	strQuery = null;
			if (rs != null)     try{rs.close();}catch (Exception ex){ex.printStackTrace();}
			if (pstmt != null)  try{pstmt.close();}catch (Exception ex2){ex2.printStackTrace();}
			if (conn != null){
				try{
					ConnectionResource.release(conn);
				}catch(Exception ex3){
					ecamsLogger.error("## MenuList.secuMenuList() connection release exception ##");
					ex3.printStackTrace();
				}
			}
		}

		
	}//end of secuMenuList() method statement
	*/ 
	
	
    public Object[] secuMenuList(String user_id) throws SQLException, Exception {
		Connection        conn        = null;
		PreparedStatement pstmt       = null;
		ResultSet         rs          = null;
		StringBuffer      strQuery    = new StringBuffer();
		Object[]		  rtObj		  = null;
		ConnectionContext connectionContext = new ConnectionResource();	
		HashMap<String, String>			    rst	   = null;
		ArrayList<HashMap<String, String>>  rtList = new ArrayList<HashMap<String, String>>();
		
		// 메뉴 순번 및 메뉴 이름 추가 변수 선언
		String tmpMenu = "";
		
		try {			
			conn = connectionContext.getConnection();

			strQuery.append("SELECT            																																										\n");
			strQuery.append("	A.ID,                                                                                               \n");
			strQuery.append("	A.PID,                                                                                              \n");
			strQuery.append("	A.MENUORDER,                                                                                        \n");
			strQuery.append("	A.TEXT,                                                                                             \n");
			strQuery.append("	DECODE(A.PID,0,'',A.LINK) AS LINK,                                                                	\n");
			strQuery.append("	A.CM_MENUCD,                                                                                        \n");
			strQuery.append("	A.CM_REQCD,                                                                                         \n");
			strQuery.append("	DECODE(A.PID,0,'','ecamsSubframe') AS TARGETNAME                                                    \n");
			strQuery.append("FROM (SELECT CASE WHEN A.CM_BEFMENU = 0 THEN TO_CHAR(A.CM_MENUCD)                                    	\n");
			strQuery.append("			  ELSE A.CM_MENUCD || '_' || A.CM_BEFMENU                                                   \n");
			strQuery.append("			  END  ID,                                                                                  \n");
			strQuery.append("		   A.CM_BEFMENU AS PID,                                                                         \n");
			strQuery.append("		   A.CM_ORDER AS MENUORDER,                                                                     \n");
			strQuery.append("		   A.CM_MANAME AS TEXT,                                                                         \n");
			strQuery.append("		   A.CM_FILENAME AS LINK,                                                                       \n");
			strQuery.append("		   A.CM_MENUCD,                                                                                 \n");
			strQuery.append("		   A.CM_REQCD                                                                                   \n");
			strQuery.append("	  FROM CMM0081 A, CMM0090 B                                                                         \n");
			strQuery.append("	 WHERE B.CM_RGTCD IN(SELECT CM_RGTCD FROM CMM0043                                                   \n");
			strQuery.append("	                      WHERE CM_USERID= ?)                                                    		\n");
			strQuery.append("	  AND A.CM_MENUCD = B.CM_MENUCD                                                                     \n");
			strQuery.append("	  GROUP BY A.CM_MENUCD,A.CM_BEFMENU,A.CM_ORDER,A.CM_MANAME,A.CM_FILENAME,A.CM_REQCD) A              \n");
			strQuery.append("  START WITH A.PID = 0                                                                               	\n");
			strQuery.append("CONNECT BY PRIOR A.CM_MENUCD = A.PID                                                                	\n");
			strQuery.append("ORDER SIBLINGS BY A.MENUORDER                                                                        	\n");  
			
            pstmt = conn.prepareStatement(strQuery.toString());
            pstmt.setString(1, user_id);			
            rs = pstmt.executeQuery();    
			while (rs.next()){
				rst = new HashMap<String, String>();
				rst.put("id", 		rs.getString("ID"));
				rst.put("pid", 		rs.getString("PID"));
				rst.put("order", 	rs.getString("MENUORDER"));
				rst.put("text", 	rs.getString("TEXT"));
				rst.put("link", 	rs.getString("LINK"));	
				rst.put("reqcd", 	rs.getString("CM_REQCD"));	
				rst.put("targetname",rs.getString("TARGETNAME"));	
				rtList.add(rst);
				rst = null;				
			}//end of while-loop statement
			rs.close();
			pstmt.close();
			conn.close();

        	rs = null;
            pstmt = null;
            conn = null;
            
            rtObj =  rtList.toArray();

			rtList = null;

			return rtObj;			
		} catch (SQLException sqlexception) {
			sqlexception.printStackTrace();
			ecamsLogger.error("## MenuList.secuMenuList() SQLException START ##");
			ecamsLogger.error("## Error DESC : ", sqlexception);	
			ecamsLogger.error("## MenuList.secuMenuList() SQLException END ##");			
			throw sqlexception;
		} catch (Exception exception) {
			exception.printStackTrace();
			ecamsLogger.error("## MenuList.secuMenuList() Exception START ##");				
			ecamsLogger.error("## Error DESC : ", exception);	
			ecamsLogger.error("## MenuList.secuMenuList() Exception END ##");				
			throw exception;
		}finally{
			if (strQuery != null) 	strQuery = null;
			if (rs != null)     try{rs.close();}catch (Exception ex){ex.printStackTrace();}
			if (pstmt != null)  try{pstmt.close();}catch (Exception ex2){ex2.printStackTrace();}
			if (conn != null){
				try{
					ConnectionResource.release(conn);
				}catch(Exception ex3){
					ecamsLogger.error("## MenuList.secuMenuList() connection release exception ##");
					ex3.printStackTrace();
				}
			}
		}

		
	}//end of secuMenuList() method statement
    
   public Object[] getLoginInfo(String user_id) throws SQLException, Exception {
		Connection        conn        = null;
		PreparedStatement pstmt       = null;
		ResultSet         rs          = null;
		StringBuffer      strQuery    = new StringBuffer();
		CreateXml      ecmmtb      = new CreateXml();
		ArrayList<Document> list = new ArrayList<Document>();
		ConnectionContext connectionContext = new ConnectionResource();	
		int menuCnt = 0;
		
		try {			
			conn = connectionContext.getConnection();

            strQuery.append("SELECT CM_USERNAME                 \n");
            strQuery.append("      ,TO_CHAR(SYSDATE,'YYYY/MM/DD HH24:MI') NOWDATE \n");
            strQuery.append("  FROM CMM0040                     \n");
            strQuery.append(" WHERE CM_USERID=?                 \n");  
            strQuery.append("   AND CM_ACTIVE='1'               \n");          
            pstmt = conn.prepareStatement(strQuery.toString());
            pstmt.setString(1, user_id);			
            rs = pstmt.executeQuery();    
            ecmmtb.init_Xml("ID","cm_userid","label","gbncd","linkyn");
			if (rs.next()){
				ecmmtb.addXML(Integer.toString(++menuCnt),
						user_id,
				//		rs.getString("NOWDATE")+" "+rs.getString("CM_USERNAME")+"님 로그인",
						rs.getString("CM_USERNAME")+"님 로그인",
						"INFO",
						"N",
						user_id);
			}//end of while-loop statement
			rs.close();
			pstmt.close();			
			conn.close();

        	rs = null;
            pstmt = null;
            conn = null;
            
			ecmmtb.addXML(Integer.toString(++menuCnt),
					user_id,
					"로그아웃",
					"OFF",
					"Y",
					user_id);
			list.add(ecmmtb.getDocument());
			

			ecmmtb.addXML(Integer.toString(++menuCnt),
					user_id,
					"HOME",
					"uModules/eCAMSProc.swf",
					"L",
					user_id);
			list.add(ecmmtb.getDocument());
			ecmmtb = null;
			return list.toArray();		
						
			
		} catch (SQLException sqlexception) {
			sqlexception.printStackTrace();
			ecamsLogger.error("## MenuList.getLoginInfo() SQLException START ##");
			ecamsLogger.error("## Error DESC : ", sqlexception);	
			ecamsLogger.error("## MenuList.getLoginInfo() SQLException END ##");			
			throw sqlexception;
		} catch (Exception exception) {
			exception.printStackTrace();
			ecamsLogger.error("## MenuList.getLoginInfo() Exception START ##");				
			ecamsLogger.error("## Error DESC : ", exception);	
			ecamsLogger.error("## MenuList.getLoginInfo() Exception END ##");				
			throw exception;
		}finally{
			if (strQuery != null) 	strQuery = null;
			if (list != null)	list = null;
			if (rs != null)     try{rs.close();}catch (Exception ex){ex.printStackTrace();}
			if (pstmt != null)  try{pstmt.close();}catch (Exception ex2){ex2.printStackTrace();}
			if (conn != null){
				try{
					ConnectionResource.release(conn);
				}catch(Exception ex3){
					ecamsLogger.error("## MenuList.getLoginInfo() connection release exception ##");
					ex3.printStackTrace();
				}
			}
		}
		
	}//end of getLoginInfo() method statement
    public Object[] getSecuList(String Sv_UserID) throws SQLException, Exception {
		Connection        conn        = null;
		PreparedStatement pstmt       = null;
		ResultSet         rs          = null;
		StringBuffer      strQuery    = new StringBuffer();
		HashMap<String, String>			  rst		  = null;
		ArrayList<HashMap<String, String>>		  rtList	  = new ArrayList<HashMap<String, String>>();
		
		ConnectionContext connectionContext = new ConnectionResource();
		
		try {
			conn = connectionContext.getConnection();

			strQuery.append("SELECT c.cm_maname,c.cm_filename,c.cm_reqcd \n");
			strQuery.append("  FROM cmm0080 c,cmm0090 b,CMM0043 a \n");
			strQuery.append(" where a.cm_userid= ? 		          \n");  
			strQuery.append("   and a.cm_rgtcd=b.cm_rgtcd         \n");  	
			strQuery.append("   and b.cm_menucd=c.cm_menucd       \n");  
			strQuery.append(" group by c.cm_maname,c.cm_filename,c.cm_reqcd \n");  		
			pstmt = conn.prepareStatement(strQuery.toString());	
			pstmt.setString(1, Sv_UserID);
			rs = pstmt.executeQuery();			
			while (rs.next()){
				rst = new HashMap<String, String>();
				rst.put("cm_maname", rs.getString("cm_maname"));
				rst.put("cm_filename", rs.getString("cm_filename"));
				rst.put("cm_reqcd", rs.getString("cm_reqcd"));
				rtList.add(rst);
				rst = null;
				
			}//end of while-loop statement			
			rs.close();
			pstmt.close();
			conn.close();
			rs = null;
			pstmt = null;
			conn = null;
			
			return rtList.toArray();		
			
		} catch (SQLException sqlexception) {
			sqlexception.printStackTrace();
			ecamsLogger.error("## UserInfo.getSecuList() SQLException START ##");
			ecamsLogger.error("## Error DESC : ", sqlexception);	
			ecamsLogger.error("## UserInfo.getSecuList() SQLException END ##");			
			throw sqlexception;
		} catch (Exception exception) {
			exception.printStackTrace();
			ecamsLogger.error("## UserInfo.getSecuList() Exception START ##");				
			ecamsLogger.error("## Error DESC : ", exception);	
			ecamsLogger.error("## UserInfo.getSecuList() Exception END ##");				
			throw exception;
		}finally{
			if (rtList != null) rtList = null;
			if (strQuery != null) 	strQuery = null;
			if (rs != null)     try{rs.close();}catch (Exception ex){ex.printStackTrace();}
			if (pstmt != null)  try{pstmt.close();}catch (Exception ex2){ex2.printStackTrace();}
			if (conn != null){
				try{
					ConnectionResource.release(conn);
				}catch(Exception ex3){
					ecamsLogger.error("## UserInfo.getSecuList() connection release exception ##");
					ex3.printStackTrace();
				}
			}
		}
	}//end of getSecuList() method statement
    
    /**
     * 접속한 사용자가 가지고 있는 시스템의 정기배포/정기빌드 정보 가져오기 (달력)
     * @param userId
     * @param month
     * @return
     * @throws SQLException
     * @throws Exception
     */
    public ArrayList<HashMap<String, String>> getCalendarInfo(String userId, String month) throws SQLException, Exception {
  		Connection        conn        = null;
  		PreparedStatement pstmt       = null;
  		ResultSet         rs          = null;
  		StringBuffer      strQuery    = new StringBuffer();
  		HashMap<String, String>	rst		  			= null;
  		ArrayList<HashMap<String, String>> rtList	= new ArrayList<HashMap<String, String>>();
  		ArrayList<HashMap<String, String>> dateArr	= new ArrayList<HashMap<String, String>>();
  		ConnectionContext connectionContext 		= new ConnectionResource();
  		
  		String prcDay 		= null;
  		int[] prcDayCnt 	= null;
  		String startDate 	= null;
  		try {
  			conn = connectionContext.getConnection();
  			
  			strQuery.append("SELECT TO_CHAR(BASE_DATE+NO,'YYYY-MM-DD') AS YYYYMMDD, to_char(BASE_DATE+NO, 'd') AS DATEDIV			\n");
  			strQuery.append("  FROM (SELECT (TO_DATE(? || '01', 'YYYYMMDD') - 1) AS BASE_DATE FROM DUAL) A							\n");
  			strQuery.append(" 	    ,(SELECT LEVEL NO FROM DUAL CONNECT BY LEVEL < 50) B											\n");
  			strQuery.append(" WHERE (BASE_DATE+NO) <= LAST_DAY(TO_DATE(? || '01', 'YYYYMMDD'))										\n");
  			strQuery.append(" ORDER BY YYYYMMDD																						\n");
  			
  			pstmt = conn.prepareStatement(strQuery.toString());	
  			pstmt.setString(1, month);
  			pstmt.setString(2, month);
  			rs = pstmt.executeQuery();			
  			
  			while (rs.next()){
  				rst = new HashMap<String, String>();
  				rst.put("YYYYMMDD", rs.getString("YYYYMMDD"));
  				rst.put("DATEDIV", rs.getString("DATEDIV"));
  				dateArr.add(rst);
  				rst = null;
  				
  			}			
  			rs.close();
  			pstmt.close();
  			
  			strQuery.setLength(0);
  			strQuery.append("SELECT  A.CM_SYSCD						\n");
  			strQuery.append("		,A.CM_SYSMSG					\n");
  			strQuery.append("		,C.CM_PRCSYS					\n");
  			strQuery.append("		,D.CM_CODENAME					\n");
  			strQuery.append("		,C.CM_SUN						\n");
  			strQuery.append("		,C.CM_MON						\n");
  			strQuery.append("		,C.CM_TUE						\n");
  			strQuery.append("		,C.CM_WED						\n");
  			strQuery.append("		,C.CM_THU						\n");
  			strQuery.append("		,C.CM_FRI						\n");
  			strQuery.append("		,C.CM_SAT						\n");
  			strQuery.append("		,C.CM_SUN || C.CM_MON || C.CM_TUE || C.CM_WED || C.CM_THU || C.CM_FRI || C.CM_SAT AS PRCDAY		\n");
  			strQuery.append("		,A.CM_SYSMSG || ' ' || '\n정기' || D.CM_CODENAME 	AS TITLE										\n");
  			strQuery.append("		,C.CM_PRCTIME																					\n");
  			strQuery.append("		,SUBSTR(C.CM_PRCTIME,0,2) || ':' || SUBSTR(C.CM_PRCTIME,3,2) AS PRCTIME							\n");
  			strQuery.append("  FROM CMM0030 A, 						\n");
  			strQuery.append("		(								\n");
  			strQuery.append("		SELECT DISTINCT CM_SYSCD		\n");
  			strQuery.append("		  FROM CMM0044					\n");
  			strQuery.append("		 WHERE CM_USERID = ?			\n");
  			strQuery.append("		   AND CM_CLOSEDT IS NULL		\n");
  			strQuery.append("		) B, CMM0030_TIME C, CMM0020 D	\n");
  			strQuery.append(" WHERE A.CM_CLOSEDT IS NULL			\n");
  			strQuery.append("   AND SUBSTR(A.CM_SYSINFO,6,1) = '1'	\n");
  			strQuery.append("   AND A.CM_SYSCD = B.CM_SYSCD			\n");
  			strQuery.append("   AND A.CM_SYSCD = C.CM_SYSCD			\n");
  			strQuery.append("   AND D.CM_MACODE = 'SYSGBN'			\n");
  			strQuery.append("   AND D.CM_MICODE = C.CM_PRCSYS		\n");
  			
  			pstmt = conn.prepareStatement(strQuery.toString());	
  			pstmt.setString(1, userId);
  			rs = pstmt.executeQuery();			
  			
  			while (rs.next()){
  				if(rs.getString("CM_SUN").equals("Y") || rs.getString("CM_MON").equals("Y")
  						|| rs.getString("CM_TUE").equals("Y") || rs.getString("CM_WED").equals("Y")
  						|| rs.getString("CM_THU").equals("Y") || rs.getString("CM_FRI").equals("Y")
  						|| rs.getString("CM_SAT").equals("Y")) {
  					prcDay = rs.getString("PRCDAY");
  					prcDayCnt = new int[7];
  					
  					for(int i = 0; i< prcDay.length(); i++) {
  						if(prcDay.charAt(i) == 'Y') {
  							prcDayCnt[i] = 1;
  						} else {
  							prcDayCnt[i] = 0;
  						}
  					}
  					
  					startDate = null;
  					
  					for(int i = 0; i < dateArr.size(); i++) {
  						for( int j = 0 ; j < prcDayCnt.length; j++) {
  							
  							if(Integer.parseInt(dateArr.get(i).get("DATEDIV")) == (j+1) &&  prcDayCnt[j] == 1) {
  								startDate = dateArr.get(i).get("YYYYMMDD") + "T" + rs.getString("PRCTIME");
  								rst = new HashMap<String, String>();
  								rst.put("title", rs.getString("TITLE"));
  								rst.put("start", startDate);
  								rst.put("color", rs.getString("CM_PRCSYS").equals("SYSCB") 
  													? "#FF5733" : "#FFC300");
  								rtList.add(rst);
  							}
  						}
  					}
  				}
  			}
  			
  			rs.close();
  			pstmt.close();
  			
  			strQuery.setLength(0);
    		strQuery.append("SELECT B.CM_CODENAME, TO_CHAR(TO_DATE(A.CM_HOLIDAY),'YYYY-MM-DD') AS CM_HOLIDAY							\n");
    		strQuery.append("  FROM CMM0050 A, CMM0020 B								\n");
    		strQuery.append(" WHERE A.CM_HOLIDAY BETWEEN ? AND TO_CHAR(LAST_DAY(TO_DATE(?)), 'YYYYMMDD')\n");
    		strQuery.append("   AND B.CM_MACODE = 'HOLIDAY'								\n");
    		strQuery.append("   AND A.CM_MSGCD = B.CM_MICODE							\n");
    		
    		pstmt = conn.prepareStatement(strQuery.toString());	
    		pstmt.setString(1, month + "01");
    		pstmt.setString(2, month + "01");
    		rs = pstmt.executeQuery();			
    		
    		while (rs.next()){
    			rst = new HashMap<String, String>();
    			rst.put("title", rs.getString("CM_CODENAME"));
    			rst.put("start", rs.getString("CM_HOLIDAY"));
    			rst.put("textColor", "#FF0000");
    			rst.put("color", "#FFF");
    			rst.put("holiday", "Y");
    			System.out.println(rst.toString());
    			rtList.add(rst);
    		}
    		rs.close();
    		pstmt.close();
  			
  			rtList.addAll(getUserReqCalInfo(userId, month+"01"));
  			
  			conn.close();
  			rs = null;
  			pstmt = null;
  			conn = null;
  			
  			return rtList;		
  			
  		} catch (SQLException sqlexception) {
  			sqlexception.printStackTrace();
  			ecamsLogger.error("## MenuList.getCalendarInfo() SQLException START ##");
  			ecamsLogger.error("## Error DESC : ", sqlexception);	
  			ecamsLogger.error("## MenuList.getCalendarInfo() SQLException END ##");			
  			throw sqlexception;
  		} catch (Exception exception) {
  			exception.printStackTrace();
  			ecamsLogger.error("## MenuList.getCalendarInfo() Exception START ##");				
  			ecamsLogger.error("## Error DESC : ", exception);	
  			ecamsLogger.error("## MenuList.getCalendarInfo() Exception END ##");				
  			throw exception;
  		}finally{
  			if (rtList != null) rtList = null;
  			if (strQuery != null) 	strQuery = null;
  			if (rs != null)     try{rs.close();}catch (Exception ex){ex.printStackTrace();}
  			if (pstmt != null)  try{pstmt.close();}catch (Exception ex2){ex2.printStackTrace();}
  			if (conn != null){
  				try{
  					ConnectionResource.release(conn);
  				}catch(Exception ex3){
  					ecamsLogger.error("## MenuList.getCalendarInfo() connection release exception ##");
  					ex3.printStackTrace();
  				}
  			}
  		}
  	}//end of getCalendarInfo() method statement
    
    /**
     * 달력에 표시할 휴일정보 가져오기
     * @param userId
     * @param month
     * @return
     * @throws SQLException
     * @throws Exception
     */
    public ArrayList<HashMap<String, String>> getHoliday(String month) throws SQLException, Exception {
    	Connection        conn        = null;
    	PreparedStatement pstmt       = null;
    	ResultSet         rs          = null;
    	StringBuffer      strQuery    = new StringBuffer();
    	HashMap<String, String>	rst		  			= null;
    	ArrayList<HashMap<String, String>> rtList	= new ArrayList<HashMap<String, String>>();
    	ConnectionContext connectionContext 		= new ConnectionResource();
    	
    	try {
    		conn = connectionContext.getConnection();
    		
    		
    		strQuery.setLength(0);
    		strQuery.append("SELECT B.CM_CODENAME, TO_CHAR(TO_DATE(A.CM_HOLIDAY),'YYYY-MM-DD') AS CM_HOLIDAY							\n");
    		strQuery.append("  FROM CMM0050 A, CMM0020 B								\n");
    		strQuery.append(" WHERE A.CM_HOLIDAY BETWEEN ? AND TO_CHAR(LAST_DAY(TO_DATE(?)), 'YYYYMMDD')\n");
    		strQuery.append("   AND B.CM_MACODE = 'HOLIDAY'								\n");
    		strQuery.append("   AND A.CM_MSGCD = B.CM_MICODE							\n");
    		
    		pstmt = conn.prepareStatement(strQuery.toString());	
    		pstmt.setString(1, month + "01");
    		pstmt.setString(2, month + "01");
    		rs = pstmt.executeQuery();			
    		
    		while (rs.next()){
    			rst = new HashMap<String, String>();
    			rst.put("title", rs.getString("CM_CODENAME"));
    			rst.put("start", rs.getString("CM_HOLIDAY"));
    			rst.put("textColor", "#FF0000");
    			rst.put("color", "#FFF");
    			rst.put("holiday", "Y");
    			System.out.println(rst.toString());
    			rtList.add(rst);
    		}
    		rs.close();
    		pstmt.close();
    		
    		
    		conn.close();
    		rs = null;
    		pstmt = null;
    		conn = null;
    		
    		return rtList;		
    		
    	} catch (SQLException sqlexception) {
    		sqlexception.printStackTrace();
    		ecamsLogger.error("## MenuList.getHoliday() SQLException START ##");
    		ecamsLogger.error("## Error DESC : ", sqlexception);	
    		ecamsLogger.error("## MenuList.getHoliday() SQLException END ##");			
    		throw sqlexception;
    	} catch (Exception exception) {
    		exception.printStackTrace();
    		ecamsLogger.error("## MenuList.getHoliday() Exception START ##");				
    		ecamsLogger.error("## Error DESC : ", exception);	
    		ecamsLogger.error("## MenuList.getHoliday() Exception END ##");				
    		throw exception;
    	}finally{
    		if (rtList != null) rtList = null;
    		if (strQuery != null) 	strQuery = null;
    		if (rs != null)     try{rs.close();}catch (Exception ex){ex.printStackTrace();}
    		if (pstmt != null)  try{pstmt.close();}catch (Exception ex2){ex2.printStackTrace();}
    		if (conn != null){
    			try{
    				ConnectionResource.release(conn);
    			}catch(Exception ex3){
    				ecamsLogger.error("## MenuList.getHoliday() connection release exception ##");
    				ex3.printStackTrace();
    			}
    		}
    	}
    }//end of getCalendarInfo() method statement
    
    /**
     * 접속한 사용자가 신청한 신청건 가져오기(달력)
     * @param userId
     * @param date
     * @return
     * @throws SQLException
     * @throws Exception
     */
    public ArrayList<HashMap<String, String>> getUserReqCalInfo(String userId, String date) throws SQLException, Exception {
		Connection        	conn        = null;
		PreparedStatement 	pstmt       = null;
		ResultSet         	rs          = null;
		StringBuffer      	strQuery    = new StringBuffer();
		int 				pstmtCnt 	= 1;
		HashMap<String, String>			  	rst	 	= null;
		ConnectionContext connectionContext = new ConnectionResource();
		ArrayList<HashMap<String, String>>  rtList	= new ArrayList<HashMap<String, String>>();
		
		try {

			conn = connectionContext.getConnection();
			
			pstmtCnt = 1;
			strQuery.setLength(0);
			strQuery.append("SELECT  B.CM_SYSMSG                                                                                                \n");
			strQuery.append("		,C.CC_SRID                                                                                                  \n");
			strQuery.append("		,C.CC_REQTITLE                                                                                              \n");
			strQuery.append("		,A.CR_ACPTNO                                                                                                \n"); 
			strQuery.append("		,D.CM_USERNAME                                                                                              \n");
			strQuery.append("		,A.CR_QRYCD		                                                                                            \n");
			strQuery.append("		,TO_CHAR(A.CR_ACPTDATE,'YYYY/MM/DD HH24:MI') AS CR_ACPTDATE                                                 \n");
			strQuery.append("		,TO_CHAR(A.CR_PRCDATE,'YYYY/MM/DD HH24:MI') AS CR_PRCDATE                                                   \n");
			strQuery.append("		,NVL(E.CM_CODENAME,'신청종류 없음') AS REQUESTNAME                                                           	\n");
			strQuery.append("		,NVL(F.CM_CODENAME,'처리구분없음') AS PASSOK                                                                 	\n");
			strQuery.append("		,GETCONFNAME(A.CR_ACPTNO,'CONF') AS CONFNAME                                                                \n");
			strQuery.append("		,GETCONFNAME(A.CR_ACPTNO,'COLOR') AS COLORSW                                                                \n");
			strQuery.append("		,TO_CHAR(A.CR_ACPTDATE,'YYYY-MM-DD') ||  'T'  ||TO_CHAR(A.CR_ACPTDATE,'HH24:MI') AS STARTDATE               \n");
			strQuery.append("  FROM	 CMR1000 A                                                                                              	\n");
			strQuery.append("  		,CMM0030 B                                                                                                  \n");
			strQuery.append("  		,CMC0100 C                                                                                                  \n");
			strQuery.append("  		,CMM0040 D                                                                                                  \n");
			strQuery.append("  		,CMM0020 E                                                                                                  \n");
			strQuery.append("  		,CMM0020 F                                                                                                  \n");
			strQuery.append(" WHERE A.CR_ACPTDATE BETWEEN TO_CHAR(TRUNC(TO_DATE(?),'MM'),'YYYYMMDD') AND TO_CHAR(LAST_DAY(TO_DATE(?)), 'YYYYMMDD')	\n");
			strQuery.append("   AND A.CR_EDITOR = ?                                                                                      		\n");
			strQuery.append("   AND A.CR_SYSCD = B.CM_SYSCD                                                                                     \n");
			strQuery.append("   AND B.CM_CLOSEDT IS NULL	                                                                                    \n");
			strQuery.append("   AND A.CR_ITSMID = C.CC_SRID(+)                                                                                  \n");
			strQuery.append("   AND A.CR_EDITOR = D.CM_USERID                                                                                   \n");
			strQuery.append("   AND E.CM_MACODE = 'REQUEST'                                                                                     \n");
			strQuery.append("   AND E.CM_USEYN = 'Y'                                                                                            \n");
			strQuery.append("   AND A.CR_QRYCD = E.CM_MICODE(+)                                                                                 \n");
			strQuery.append("   AND F.CM_MACODE = 'REQPASS'                                                                                     \n");
			strQuery.append("   AND F.CM_USEYN = 'Y'                                                                                            \n");
			strQuery.append("   AND A.CR_PASSOK = F.CM_MICODE                                                                                   \n");
			strQuery.append(" ORDER BY A.CR_ACPTDATE DESC                                                                                       \n");
			
			pstmt = conn.prepareStatement(strQuery.toString());
			pstmt.setString(pstmtCnt++, date);
			pstmt.setString(pstmtCnt++, date);
			pstmt.setString(pstmtCnt++, userId);
			
            rs = pstmt.executeQuery();
             
			while (rs.next()){
	            rst = new HashMap<String, String>();
        		
	            rst.put("cr_acptno", rs.getString("CR_ACPTNO"));
	            rst.put("cr_qrycd", rs.getString("CR_QRYCD"));
        		rst.put("title", "["+rs.getString("CR_ACPTNO")+"]\n"+rs.getString("CONFNAME"));
				rst.put("start", rs.getString("STARTDATE"));
        		if("0".equals(rs.getString("COLORSW"))) {
        			rst.put("color", "#0000FF");
        		}
        		if("3".equals(rs.getString("COLORSW"))) {
        			rst.put("color", "#FF0000");
        		}
        		if("5".equals(rs.getString("COLORSW"))) {
        			rst.put("color", "#E719FF");
        		}
        		if("9".equals(rs.getString("COLORSW"))) {
        			rst.put("color", "#000000");
        		}
        		
    			rtList.add(rst);
        		rst = null;
			}

			rs.close();
			pstmt.close();
			conn.close();
			
			rs = null;
			pstmt = null;
			conn = null;

			return rtList;

		} catch (SQLException sqlexception) {
			sqlexception.printStackTrace();
			ecamsLogger.error("## MenuList.getUserReqCalInfo() SQLException START ##");
			ecamsLogger.error("## Error DESC : ", sqlexception);
			ecamsLogger.error("## MenuList.getUserReqCalInfo() SQLException END ##");
			throw sqlexception;
		} catch (Exception exception) {
			exception.printStackTrace();
			ecamsLogger.error("## MenuList.getUserReqCalInfo() Exception START ##");
			ecamsLogger.error("## Error DESC : ", exception);
			ecamsLogger.error("## MenuList.getUserReqCalInfo() Exception END ##");
			throw exception;
		}finally{
			if (strQuery != null) 	strQuery = null;
			if (rtList != null)	rtList = null;
			if (rs != null)     try{rs.close();}catch (Exception ex){ex.printStackTrace();}
			if (pstmt != null)  try{pstmt.close();}catch (Exception ex2){ex2.printStackTrace();}
			if (conn != null){
				try{
					conn.close();
				}catch(Exception ex3){
					ecamsLogger.error("## MenuList.getUserReqCalInfo() connection release exception ##");
					ex3.printStackTrace();
				}
			}
		}
	}//end of SelectList() method statement
   
    /**
     * 접속한 사용자의 미결/SR/오류 라벨 건수 가져오기
     * @param userId
     * @param date
     * @return
     * @throws SQLException
     * @throws Exception
     */
    public HashMap<String, Integer> getPrcLabel(String userId) throws SQLException, Exception {
    	Connection        	conn        = null;
    	PreparedStatement 	pstmt       = null;
    	PreparedStatement 	pstmt2      = null;
    	ResultSet         	rs          = null;
    	ResultSet         	rs2         = null;
    	StringBuffer      	strQuery    = new StringBuffer();
    	int 				pstmtCnt 	= 1;
    	HashMap<String, Integer> rst = new HashMap<String, Integer>();
    	ConnectionContext connectionContext = new ConnectionResource();
    	
    	try {
    		
    		conn = connectionContext.getConnection();
    		
    		
    		rst.put("devSrCnt", 0);
    		rst.put("testSrCnt", 0);
    		rst.put("appySrCnt", 0);
    		rst.put("etcSrCnt", 0);
    		
    		rst.put("devPrgCnt", 0);
    		rst.put("testPrgCnt", 0);
    		rst.put("appyPrgCnt", 0);
    		rst.put("etcPrgCnt", 0);
    		
    		
    		// 미결 건수 가져오기
    		pstmtCnt = 1;
    		strQuery.setLength(0);
    		strQuery.append("select 'CF1' cd,count(*) cnt          						\n");
    		strQuery.append("  from cmr1000 b,cmr9900 a           						\n");
    		strQuery.append(" where a.cr_status='0'               						\n");
    		strQuery.append("   and a.cr_locat='00'               						\n");
    		strQuery.append("   and a.cr_teamcd in ('2','3','6','7','8','P')	 		\n");
    		strQuery.append("   and a.cr_team= ?                   						\n");
    		strQuery.append("   and a.cr_acptno=b.cr_acptno 	  						\n");
    		strQuery.append("   and b.cr_status not in('3','9')   						\n");
    		
    		strQuery.append("union                               						\n");
    		strQuery.append("select 'CF2' cd,count(*) cnt          						\n");
    		strQuery.append("  from (                             						\n");
    		strQuery.append("		select distinct b.cr_acptno  						\n");
    		strQuery.append("		  from cmm0043 c,cmr1000 b,cmr9900 a 				\n");
    		strQuery.append("		 where a.cr_status='0'               				\n");
    		strQuery.append("		   and a.cr_locat='00'               				\n");
    		strQuery.append("		   and a.cr_teamcd not in ('2','3','6','7','8','P') \n");
    		strQuery.append("		   and instr(a.cr_team,c.cm_rgtcd)>0 				\n");
    		strQuery.append("		   and c.cm_userid= ?            	  				\n");
    		strQuery.append("		   and a.cr_acptno=b.cr_acptno 	  					\n");
    		strQuery.append("		   and b.cr_status not in('3','9'))  				\n");
    		
    		strQuery.append("union                               						\n");
    		strQuery.append("select 'CF3' cd,count(*) cnt          						\n");
    		strQuery.append("  from cmc0300 b,cmr9900 a           						\n");
    		strQuery.append(" where a.cr_status='0'               						\n");
    		strQuery.append("   and a.cr_locat='00'               						\n");
    		strQuery.append("   and a.cr_teamcd in ('2','3','6','7','8','P') 			\n");
    		strQuery.append("   and a.cr_team= ?                    					\n");
    		strQuery.append("   and a.cr_acptno=b.cc_acptno 	  						\n");

    		strQuery.append("union                               						\n");
			strQuery.append("select 'CF4' cd,count(*) cnt          						\n");
			strQuery.append("  from (                             						\n");
			strQuery.append("		select distinct a.cr_acptno  						\n");
			strQuery.append("		  from cmm0043 c,cmc0300 b,cmr9900 a 				\n");
			strQuery.append("		 where a.cr_status='0'               				\n");
			strQuery.append("		   and a.cr_locat='00'               				\n");
			strQuery.append("		   and a.cr_teamcd not in ('2','3','6','7','8','P') \n");
			strQuery.append("		   and instr(a.cr_team,c.cm_rgtcd)>0 				\n");
			strQuery.append("		   and c.cm_userid= ?             	  				\n");
			strQuery.append("          and a.cr_acptno=b.cc_acptno)						\n");
    		
    		pstmt = conn.prepareStatement(strQuery.toString());
    		pstmt.setString(pstmtCnt++, userId);
    		pstmt.setString(pstmtCnt++, userId);
    		pstmt.setString(pstmtCnt++, userId);
    		pstmt.setString(pstmtCnt++, userId);
    		rs = pstmt.executeQuery();
    		while (rs.next()){
    			if(rs.getRow() == 1) {
    				rst.put("approvalCnt", rs.getInt("cnt"));
    			} else {
    				rst.put("approvalCnt", rst.get("approvalCnt") + rs.getInt("cnt"));
    			}
    		}
    		rs.close();
    		pstmt.close();
    		
    		// SR건수 가져오기
    		pstmtCnt = 1;
    		strQuery.setLength(0);
    		strQuery.append("SELECT COUNT(*) CNT         			\n");
    		strQuery.append("  FROM CMC0110 B,CMC0100 A          	\n"); 
    		strQuery.append(" WHERE A.CC_STATUS IN ('2','4','5','6','7','A','C','D')	\n");
    		strQuery.append("   AND A.CC_SRID=B.CC_SRID           	\n");
    		strQuery.append("   AND B.CC_STATUS NOT IN ('3','8','9')\n");
    		strQuery.append("   AND B.CC_USERID= ?					\n");
    		
    		
    		pstmt = conn.prepareStatement(strQuery.toString());
    		pstmt.setString(pstmtCnt++, userId);
    		rs = pstmt.executeQuery();
    		if (rs.next()){
				rst.put("srCnt", rs.getInt("CNT"));
    		}
    		rs.close();
    		pstmt.close();
    		
    		// 오류건수 가져오기
    		pstmtCnt = 1;
    		strQuery.setLength(0);
    		strQuery.append("SELECT COUNT(*) CNT 								\n");
    		strQuery.append("  FROM (SELECT CR_ACPTNO FROM CMR9900				\n");
    		strQuery.append("		  WHERE CR_LOCAT='00'         				\n");
    		strQuery.append("			AND CR_TEAMCD='1'         				\n");
    		strQuery.append("			AND CR_STATUS='0') A,     				\n");
    		strQuery.append("		(SELECT Y.CR_ACPTNO            				\n");
    		strQuery.append("		   FROM CMR1000 Y,CMR1011 X    				\n");
    		strQuery.append("		  WHERE Y.CR_QRYCD IN('01','02','03','04','06','07','08','11')	\n"); 
    		strQuery.append("			AND Y.CR_STATUS ='0'					\n");       
    		strQuery.append("			AND Y.CR_EDITOR = ?						\n");        
    		strQuery.append("			AND Y.CR_ACPTNO=X.CR_ACPTNO				\n");
    		strQuery.append("			AND NVL(X.CR_PUTCODE,'0000')<>'0000'	\n");
    		strQuery.append("		  GROUP BY Y.CR_ACPTNO) C					\n");      
    		strQuery.append(" WHERE C.CR_ACPTNO=A.CR_ACPTNO						\n");
    		
    		pstmt = conn.prepareStatement(strQuery.toString());
    		pstmt.setString(pstmtCnt++, userId);
    		rs = pstmt.executeQuery();
    		if (rs.next()){
				rst.put("errCnt", rs.getInt("CNT"));
    		}
    		rs.close();
    		pstmt.close();
    		
    		// SR등록건수 가져오기
    		pstmtCnt = 1;
    		strQuery.setLength(0);
    		strQuery.append("SELECT COUNT(DISTINCT A.CC_SRID) AS PROCSR					\n");
    		strQuery.append("  FROM CMC0110 B,CMC0100 A, CMR1000 C						\n");
    		strQuery.append(" WHERE A.CC_STATUS IN ('2','4','5','6','7','A','C','D')	\n");
    		strQuery.append("   AND A.CC_SRID=B.CC_SRID           						\n");
    		strQuery.append("   AND B.CC_STATUS NOT IN ('3','8','9')					\n");
    		strQuery.append("   AND B.CC_USERID= ?										\n");
    		strQuery.append("   AND A.CC_SRID = C.CR_ITSMID								\n");
    		strQuery.append("   AND C.CR_STATUS <> '3'									\n");
    		strQuery.append("   AND C.CR_QRYCD IN ('01','02','03','04','07','08')		\n");
    		pstmt = conn.prepareStatement(strQuery.toString());
    		pstmt.setString(pstmtCnt++, userId);
    		rs = pstmt.executeQuery();
    		
    		if (rs.next()){
    			int srRegCnt = rst.get("srCnt") - rs.getInt("PROCSR");
				
				// SR로 프로그램이 등록된수 빼기(개발로보기)
				pstmtCnt = 1;
	    		strQuery.setLength(0);
				strQuery.append("SELECT COUNT(X.CC_SRID) AS srProgRegCnt				\n");
				strQuery.append("  FROM 												\n");
				strQuery.append("		(SELECT A.CC_SRID								\n");
				strQuery.append("		   FROM CMC0110 B,CMC0100 A						\n");          	 
				strQuery.append("		  WHERE A.CC_STATUS IN ('2','4','5','6','7','A','C','D')	\n");		
				strQuery.append("		    AND A.CC_SRID=B.CC_SRID						\n");           	
				strQuery.append("		    AND B.CC_STATUS NOT IN ('3','8','9')		\n");
				strQuery.append("			AND B.CC_USERID= ?							\n");
				strQuery.append("		 MINUS											\n");
				strQuery.append("		 SELECT DISTINCT A.CC_SRID						\n");
				strQuery.append("		   FROM CMC0110 B,CMC0100 A, CMR1000 C			\n");
				strQuery.append("		  WHERE A.CC_STATUS IN ('2','4','5','6','7','A','C','D')\n");		
				strQuery.append("			AND A.CC_SRID=B.CC_SRID						\n");           	
				strQuery.append("			AND B.CC_STATUS NOT IN ('3','8','9')		\n");
				strQuery.append("			AND B.CC_USERID= ?							\n");
				strQuery.append("			AND A.CC_SRID = C.CR_ITSMID					\n");
				strQuery.append("			AND C.CR_STATUS <> '3'						\n");
				strQuery.append("  			AND C.CR_QRYCD IN ('01','02','03','04','07','08')	\n");
				strQuery.append("		  ORDER BY CC_SRID DESC) X, CMR0020 Y			\n");
				strQuery.append("WHERE X.CC_SRID = Y.CR_ISRID							\n");
				pstmt2 = conn.prepareStatement(strQuery.toString());
	    		pstmt2.setString(pstmtCnt++, userId);
	    		pstmt2.setString(pstmtCnt++, userId);
	    		rs2 = pstmt2.executeQuery();
	    		
	    		if(rs2.next()) {
	    			// 등록 sr에서는 프로그램등록 SR빼기
	    			srRegCnt = srRegCnt - rs2.getInt("srProgRegCnt");
	    			// 개발 SR에는 프로그램등록 SR 넣어주기
	    			rst.put("devSrCnt", rs2.getInt("srProgRegCnt"));
	    		}
	    		rst.put("srRegCnt", srRegCnt);
	    		rs2.close();
	    		pstmt2.close();
				
    		}
    		rs.close();
    		pstmt.close();
    		
    		// 진행중인 SR목록 가져오기 (신청건 있을경우)
    		pstmtCnt = 1;
    		strQuery.setLength(0);
    		strQuery.append("SELECT DISTINCT A.CC_SRID								\n");
    		strQuery.append("  FROM CMC0110 B,CMC0100 A, CMR1000 C					\n");
    		strQuery.append(" WHERE A.CC_STATUS IN ('2','4','5','6','7','A','C','D')\n");		
    		strQuery.append("   AND A.CC_SRID=B.CC_SRID								\n");           	
    		strQuery.append("   AND B.CC_STATUS NOT IN ('3','8','9')				\n");
    		strQuery.append("   AND B.CC_USERID= ?									\n");
    		strQuery.append("   AND A.CC_SRID = C.CR_ITSMID							\n");
    		strQuery.append("   AND C.CR_STATUS <> '3'								\n");
    		strQuery.append("  	AND C.CR_QRYCD IN ('01','02','03','04','07','08')	\n");
    		strQuery.append(" ORDER BY CC_SRID DESC									\n");
    		pstmt = conn.prepareStatement(strQuery.toString());
    		pstmt.setString(pstmtCnt++, userId);
    		rs = pstmt.executeQuery();
    		
    		while(rs.next()){
    			// 해당 SR의 가장 마지막 신청건 확인 하여 SR건수 만들어주기
    			String qryCd = null;
    			pstmtCnt = 1;
        		strQuery.setLength(0);
    			strQuery.append("SELECT CR_QRYCD					\n");
    			strQuery.append("  FROM (SELECT *					\n"); 
    			strQuery.append("		   FROM CMR1000				\n"); 
    			strQuery.append("		  WHERE CR_ITSMID = ?		\n"); 
    			strQuery.append("			AND CR_STATUS <> '3'	\n"); 
    			strQuery.append("  			AND CR_QRYCD IN ('01','02','03','04','07','08')	\n");
    			strQuery.append("		  ORDER BY CR_ACPTDATE DESC)\n");
    			strQuery.append(" WHERE ROWNUM = 1					\n");
    			
    			pstmt2 = conn.prepareStatement(strQuery.toString());
        		pstmt2.setString(pstmtCnt++, rs.getString("CC_SRID"));
        		rs2 = pstmt2.executeQuery();
        		
        		if(rs2.next()) {
        			qryCd = rs2.getString("CR_QRYCD");
        			switch (rs2.getString("CR_QRYCD")) {
	    				case "01":
	    				case "02":
	    				case "07":
	    				case "08":
	    					rst.put("devSrCnt", rst.get("devSrCnt") + 1);
	    					break;
	    				case "03":
	    					rst.put("testSrCnt", rst.get("testSrCnt") + 1);
	    					break;
	    				case "04":
	    					rst.put("appySrCnt", rst.get("appySrCnt") + 1);
	    					break;
	    				default:
	    					rst.put("etcSrCnt", rst.get("etcSrCnt") + 1);
	    					// SR숫자 안맞을시 열어서 SR-ID 확인
	    					//System.out.println("SR ID : " + rs.getString("CC_SRID"));
	    					break;
    				}
        		}
        		rs2.close();
        		pstmt2.close();
        		
        		// 해당 SR에 역인 프로그램 개수 가져오기
        		pstmtCnt = 1;
        		strQuery.setLength(0);
        		strQuery.append("SELECT COUNT(DISTINCT B.CR_ITEMID) AS PROGCNT	\n");
        		strQuery.append("  FROM CMR1000 A, CMR1010 B					\n");
        		strQuery.append(" WHERE A.CR_ITSMID = ?							\n");
        		strQuery.append("   AND A.CR_QRYCD = ?							\n");
        		strQuery.append("   AND A.CR_ACPTNO = B.CR_ACPTNO				\n");
        		strQuery.append("   AND A.CR_STATUS <> '3'						\n");
        		strQuery.append("   AND B.CR_STATUS <> '3'						\n");
        		strQuery.append("  	AND A.CR_QRYCD IN ('01','02','03','04','07','08')	\n");
        		pstmt2 = conn.prepareStatement(strQuery.toString());
        		pstmt2.setString(pstmtCnt++, rs.getString("CC_SRID"));
        		pstmt2.setString(pstmtCnt++, qryCd);
        		rs2 = pstmt2.executeQuery();
        		
        		if(rs2.next()) {
        			switch (qryCd) {
	        			case "01":
	    				case "02":
	    				case "07":
	    				case "08":
	    					rst.put("devPrgCnt", rst.get("devPrgCnt") + rs2.getInt("PROGCNT"));
	    					break;
	    				case "03":
	    					rst.put("testPrgCnt", rst.get("testPrgCnt") + rs2.getInt("PROGCNT"));
	    					break;
	    				case "04":
	    					rst.put("appyPrgCnt", rst.get("appyPrgCnt") + rs2.getInt("PROGCNT"));
	    					break;
	    				default:
	    					rst.put("etcPrgCnt", rst.get("etcPrgCnt") + rs2.getInt("PROGCNT"));
	    					break;
					}
        		}
        		rs2.close();
        		pstmt2.close();
        		
    		}
    		rs.close();
    		pstmt.close();
    		
    		
    		// 진행중인 SR목록 가져오기 중 프로그램 등록건 개수가져오기 (프로그램 등록건이 있는 경우 - 개발상태로 보기)
    		pstmtCnt = 1;
    		strQuery.setLength(0);
    		strQuery.append("SELECT COUNT(DISTINCT Y.CR_ITEMID) AS PROGCNT				\n");
    		strQuery.append("  FROM														\n"); 
    		strQuery.append("		(SELECT A.CC_SRID									\n");
    		strQuery.append("		   FROM CMC0110 B,CMC0100 A							\n");          	 
    		strQuery.append("		  WHERE A.CC_STATUS IN ('2','4','5','6','7','A','C','D')\n");		
    		strQuery.append("			AND A.CC_SRID=B.CC_SRID							\n");           	
    		strQuery.append("			AND B.CC_STATUS NOT IN ('3','8','9')			\n");
    		strQuery.append("			AND B.CC_USERID= ?								\n");
    		strQuery.append("		 MINUS												\n");
    		strQuery.append("		 SELECT DISTINCT A.CC_SRID							\n");
    		strQuery.append("		   FROM CMC0110 B,CMC0100 A, CMR1000 C				\n");
    		strQuery.append("		  WHERE A.CC_STATUS IN ('2','4','5','6','7','A','C','D')\n");		
    		strQuery.append("			AND A.CC_SRID=B.CC_SRID							\n");           	
    		strQuery.append("			AND B.CC_STATUS NOT IN ('3','8','9')			\n");
    		strQuery.append("			AND B.CC_USERID= ?								\n");
    		strQuery.append("			AND A.CC_SRID = C.CR_ITSMID						\n");
    		strQuery.append("  			AND C.CR_QRYCD IN ('01','02','03','04','07','08','16')	\n");
    		strQuery.append("		  ORDER BY CC_SRID DESC) X, CMR0020 Y				\n");
    		strQuery.append(" WHERE X.CC_SRID = Y.CR_ISRID								\n");
    		
    		pstmt = conn.prepareStatement(strQuery.toString());
    		pstmt.setString(pstmtCnt++, userId);
    		pstmt.setString(pstmtCnt++, userId);
    		rs = pstmt.executeQuery();
    		while(rs.next()) {
    			rst.put("devPrgCnt", rst.get("devPrgCnt") + rs.getInt("PROGCNT"));
    		}
    		
    		rs.close();
    		pstmt.close();
    		conn.close();
    		
    		rs = null;
    		pstmt = null;
    		conn = null;
    		
    		return rst;
    		
    	} catch (SQLException sqlexception) {
    		sqlexception.printStackTrace();
    		ecamsLogger.error("## MenuList.getPrcLabel() SQLException START ##");
    		ecamsLogger.error("## Error DESC : ", sqlexception);
    		ecamsLogger.error("## MenuList.getPrcLabel() SQLException END ##");
    		throw sqlexception;
    	} catch (Exception exception) {
    		exception.printStackTrace();
    		ecamsLogger.error("## MenuList.getPrcLabel() Exception START ##");
    		ecamsLogger.error("## Error DESC : ", exception);
    		ecamsLogger.error("## MenuList.getPrcLabel() Exception END ##");
    		throw exception;
    	}finally{
    		if (strQuery != null) 	strQuery = null;
    		if (rs != null)     try{rs.close();}catch (Exception ex){ex.printStackTrace();}
    		if (pstmt != null)  try{pstmt.close();}catch (Exception ex2){ex2.printStackTrace();}
    		if (conn != null){
    			try{
    				conn.close();
    			}catch(Exception ex3){
    				ecamsLogger.error("## MenuList.getPrcLabel() connection release exception ##");
    				ex3.printStackTrace();
    			}
    		}
    	}
    }//end of SelectList() method statement
    
    /**
     * 메인화면 접속자의 최근 SR리스트 5개 가져오기
     * @param userId
     * @param date
     * @return
     * @throws SQLException
     * @throws Exception
     */
    public ArrayList<HashMap<String, String>> getSrList(String userId) throws SQLException, Exception {
    	Connection        	conn        = null;
    	PreparedStatement 	pstmt       = null;
    	PreparedStatement 	pstmt2      = null;
    	ResultSet         	rs          = null;
    	ResultSet         	rs2         = null;
    	StringBuffer      	strQuery    = new StringBuffer();
    	int 				pstmtCnt 	= 1;
    	HashMap<String, String> rst = new HashMap<String, String>();
    	ArrayList<HashMap<String, String>> rstArr = new ArrayList<HashMap<String, String>>();
    	ConnectionContext connectionContext = new ConnectionResource();
    	
    	try {
    		
    		conn = connectionContext.getConnection();
    		
    		/**
    		 * SR등록 1
    		 * SR접수완료 2
    		 * 진행중 {
    		 * 		체크아웃/프로그램등록 3
    		 * 		체크인 4
    		 * 		개발배포 5
    		 * 		테스트배포 6
    		 * 		운영배포 요청 7
    		 * 		운영배포 완료 8
    		 * }
    		 * SR완료 9
    		 */
    		
    		// 최근 SR 5건 가져오기
    		pstmtCnt = 1;
    		strQuery.setLength(0);
    		strQuery.append("SELECT A.CC_SRID, 							\n");
    		strQuery.append("		A.CC_USERID, 						\n");
    		strQuery.append("		A.CC_STATUS AS DEVSTATUS,			\n"); 
    		strQuery.append("		C.CM_CODENAME AS DEVSTATUSNAME,		\n"); 
    		strQuery.append("		B.CC_STATUS AS SRSTATUS,			\n"); 
    		strQuery.append("		D.CM_CODENAME AS SRSTATUSNAME		\n");
    		strQuery.append("		,B.CC_REQTITLE						\n");
    		
    		strQuery.append("		,TO_CHAR(B.CC_CREATEDATE, 'yyyy/mm/dd HH24:MI:SS') AS SRACPTDATE	\n");
    		strQuery.append("		,TO_CHAR(A.CC_CREATEDATE, 'yyyy/mm/dd HH24:MI:SS') AS DEVACPTDATE	\n");
    		strQuery.append("		,TO_CHAR(B.CC_COMPDATE, 'yyyy/mm/dd HH24:MI:SS') AS COMPDATE		\n");
    		
    		strQuery.append("  FROM										\n"); 
    		strQuery.append("	(										\n");
    		strQuery.append("	SELECT *								\n");
    		strQuery.append("	  FROM CMC0110							\n");
    		strQuery.append("	 WHERE CC_USERID = ?					\n");
    		strQuery.append("	 ORDER BY CC_CREATEDATE DESC) A,		\n"); 
    		strQuery.append("	CMC0100 B,								\n"); 
    		strQuery.append("	CMM0020 C,								\n"); 
    		strQuery.append("	CMM0020 D								\n");
    		strQuery.append(" WHERE ROWNUM < 7							\n");
    		strQuery.append("   and a.cc_status not in ('3', '8', 'C', 'D')	\n");
    		strQuery.append("   AND A.CC_SRID = B.CC_SRID				\n");
    		strQuery.append("   AND C.CM_MACODE = 'ISRSTAUSR'			\n");
    		strQuery.append("   AND A.CC_STATUS = C.CM_MICODE			\n");
    		strQuery.append("   AND D.CM_MACODE = 'ISRSTA'				\n");
    		strQuery.append("   AND B.CC_STATUS = D.CM_MICODE			\n");
    		
    		pstmt = conn.prepareStatement(strQuery.toString());
    		pstmt.setString(pstmtCnt++, userId);
    		rs = pstmt.executeQuery();
    		
    		while (rs.next()){
    			rst = new HashMap<>();
    			rst.put("reqTitle", rs.getString("CC_REQTITLE"));
    			rst.put("srId", rs.getString("CC_SRID"));
    			rst.put("step1", rs.getString("SRACPTDATE"));
    			rst.put("step2", rs.getString("DEVACPTDATE"));
    			/**
    			 *  [0] : 등록완료
    			 *  [1] : 등록승인중
    			 *  [2] : 접수완료
    			 *  [9] : SR완료
    			 */
    			if(rs.getString("SRSTATUS").equals("0") || rs.getString("SRSTATUS").equals("1")
    					|| rs.getString("SRSTATUS").equals("2")) {
    				rst.put("step", rs.getString("SRSTATUS").equals("0") ? "1" : rs.getString("SRSTATUS") );
    				rst.put("stepLabel", rs.getString("SRSTATUSNAME"));
    			} else {
    				
    				
    				// 개발 진행중이므로 개발 진행 어디까지 되었는지 체크
    				pstmtCnt = 1;
    	    		strQuery.setLength(0);
    	    		
    	    		
    	    		strQuery.append("select a.cr_acptno, a.cr_status, a.cr_qrycd, b.cm_codename			\n");
    	    		strQuery.append("		,to_char(a.cr_acptdate, 'yyyy/mm/dd HH24:MI') as acptdate	\n");
    	    		strQuery.append("		,TO_CHAR(A.CR_PRCDATE, 'yyyy/mm/dd HH24:MI') as prcdate		\n");
    	    		strQuery.append("  from cmr1000 a, cmm0020 b								\n");
    	    		strQuery.append(" where a.cr_itsmid = ?										\n");
    	    		strQuery.append("   and a.cr_editor = ?										\n");
    	    		strQuery.append("   and a.cr_status <> '3'									\n");
    	    		strQuery.append("   and a.cr_qrycd in ('01', '03', '04', '07', '08')		\n");
    	    		strQuery.append("   and b.cm_macode = 'REQUEST'								\n");
    	    		strQuery.append("   and a.cr_qrycd = b.cm_micode							\n");
    	    		strQuery.append(" order by case when a.cr_qrycd = '01' then 0				\n");
    	    		strQuery.append("				when a.cr_qrycd = '07' then 1				\n");
    	    		strQuery.append("				when a.cr_qrycd = '08' then 2				\n");
    	    		strQuery.append("				when a.cr_qrycd = '03' then 3				\n");
    	    		strQuery.append("				when a.cr_qrycd = '04' then 4				\n");
    	    		strQuery.append("				end, a.cr_acptdate							\n");
    	    		
    				pstmt2 = conn.prepareStatement(strQuery.toString());
    	    		pstmt2.setString(pstmtCnt++, rs.getString("CC_SRID"));
    	    		pstmt2.setString(pstmtCnt++, userId);
    	    		rs2 = pstmt2.executeQuery();
    	    		
    	    		// 각 신청건 중 가장큰 값 세팅
    	    		while(rs2.next()) {
    	    			rst.put("step" +  makeStep(rs2.getString("cr_qrycd")) , rs2.getString("acptdate"));
    	    			if(rst.containsKey("step")) {
    	    				if( Integer.parseInt(makeStep(rs2.getString("cr_qrycd"))) >  Integer.parseInt(rst.get("step")) ) {
    	    					rst.put("step",   makeStep(rs2.getString("cr_qrycd")) );
    	    					rst.put("stepLabel", rs2.getString("cm_codename") + (rs2.getString("cr_status").equals("0") ? "중" : " 완료" ));
    	    					
    	    					// 운영 배포 값 7로 되어있기 때문에 운영배포 완료시에는 8로 업그레이드
    	    					if(rs2.getString("cr_qrycd").equals("04") && !rs2.getString("cr_status").equals("0")) {
    	    						rst.put("step", "8");
    	    						rst.put("stepLabel", rs2.getString("cm_codename") + (rs2.getString("cr_status").equals("0") ? "중" : " 완료" ));
    	    						rst.put("step8", rs2.getString("prcdate"));
    	    					}
    	    				}
    	    				
    	    			} else {
    	    				rst.put("step",  makeStep(rs2.getString("cr_qrycd")) );
    	    				rst.put("stepLabel", rs2.getString("cm_codename") + (rs2.getString("cr_status").equals("0") ? "중" : " 완료" ));
    	    			}
    	    			
    	    		}
    	    		
    	    		// 만약 해당 SR 신청건 없다면 프로그램 등록건 있는지 체크
    	    		if(!rst.containsKey("step")) {
    	    			pstmtCnt = 1;
        	    		strQuery.setLength(0);
    	    			strQuery.append("select count(*) cnt			\n");
    	    			strQuery.append("  from cmr0020					\n");
    	    			strQuery.append(" where CR_ISRID is not null	\n");
    	    			strQuery.append("   and cr_isrid = ?			\n");
    	    			strQuery.append("   and cr_creator = ?			\n");
    	    			
    	    			pstmt2 = conn.prepareStatement(strQuery.toString());
        	    		pstmt2.setString(pstmtCnt++, rs.getString("CC_SRID"));
        	    		pstmt2.setString(pstmtCnt++, userId);
        	    		rs2 = pstmt2.executeQuery();
        	    		
        	    		if(rs2.next()) {
        	    			if(rs2.getInt("cnt") > 0 ) {
        	    				rst.put("step",  "3" );
        	    				rst.put("stepLabel", "프로그램 신규등록");
        	    			} else {
        	    				rst.put("step",  "2" );
        	    				rst.put("stepLabel", "접수완료");
        	    			}
        	    		}
    	    		}
    	    		
    	    		// SR완료 일시 그이전 데이터 넣어주기
    				if(rs.getString("SRSTATUS").equals("9")) {
    					rst.put("step", rs.getString("SRSTATUS").equals("0") ? "1" : rs.getString("SRSTATUS") );
        				rst.put("stepLabel", rs.getString("SRSTATUSNAME"));
        				rst.put("step9", rs.getString("COMPDATE"));
    				}
    			}
    			
    			rstArr.add(rst);
    			rst = null;
    			
    		}
    		
    		rs.close();
    		pstmt.close();
    		conn.close();
    		
    		rs = null;
    		pstmt = null;
    		conn = null;
    		
    		return rstArr;
    		
    	} catch (SQLException sqlexception) {
    		sqlexception.printStackTrace();
    		ecamsLogger.error("## MenuList.getPrcLabel() SQLException START ##");
    		ecamsLogger.error("## Error DESC : ", sqlexception);
    		ecamsLogger.error("## MenuList.getPrcLabel() SQLException END ##");
    		throw sqlexception;
    	} catch (Exception exception) {
    		exception.printStackTrace();
    		ecamsLogger.error("## MenuList.getPrcLabel() Exception START ##");
    		ecamsLogger.error("## Error DESC : ", exception);
    		ecamsLogger.error("## MenuList.getPrcLabel() Exception END ##");
    		throw exception;
    	}finally{
    		if (strQuery != null) 	strQuery = null;
    		if (rs != null)     try{rs.close();}catch (Exception ex){ex.printStackTrace();}
    		if (pstmt != null)  try{pstmt.close();}catch (Exception ex2){ex2.printStackTrace();}
    		if (conn != null){
    			try{
    				conn.close();
    			}catch(Exception ex3){
    				ecamsLogger.error("## MenuList.getPrcLabel() connection release exception ##");
    				ex3.printStackTrace();
    			}
    		}
    	}
    }//end of SelectList() method statement
    
    
    /**
     * 진행중 {
	 * 		체크아웃3
	 * 		체크인 4
	 * 		개발배포 5
	 * 		테스트배포 6
	 * 		운영배포  7
     */
    public String makeStep(String qrycd) {
    	String step = "0";
    	switch (qrycd) {
		case "01":
			step = "3";
			break;
		case "03":
			step = "6";
			break;
		case "04":
			step = "7";
			break;
		case "07":
			step = "4";
			break;
		case "08":
			step = "5";
			break;
		}
    	return step;
    }
}//end of MenuList class statement
