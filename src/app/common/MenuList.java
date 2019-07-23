
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
        		if(rs.getString("COLORSW").equals("0")) {
        			rst.put("color", "#0000FF");
        		}
        		if(rs.getString("COLORSW").equals("3")) {
        			rst.put("color", "#FF0000");
        		}
        		if(rs.getString("COLORSW").equals("5")) {
        			rst.put("color", "#E719FF");
        		}
        		if(rs.getString("COLORSW").equals("9")) {
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
    
}//end of MenuList class statement
