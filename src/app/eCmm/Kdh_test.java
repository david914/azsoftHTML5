package app.eCmm;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;

import org.apache.log4j.Logger;

import app.common.LoggableStatement;

import com.ecams.common.dbconn.ConnectionContext;
import com.ecams.common.dbconn.ConnectionResource;
import com.ecams.common.logger.EcamsLogger;
//import com.ecams.common.logger.EcamsLogger;

public class Kdh_test {

	Logger ecamsLogger  = EcamsLogger.getLoggerInstance();
	//Logger ecamsLogger  = EcamsLogger.getLoggerInstance();

	public Object[] getUserList() throws SQLException,Exception {
		
    	Connection			conn		= null;
    	PreparedStatement	pstmt		= null;
		ResultSet         	rs          = null;
		String		      	Query    = "";
		ArrayList<HashMap<String, String>>  rsval = new ArrayList<HashMap<String, String>>();
		HashMap<String, String>			  	rst	  = null; 
		Object[] returnObjectArray    = null;
		try{
			Query = "select a.cm_userid, a.cm_username, a.cm_position, b.cm_codename position, a.cm_duty, c.cm_codename duty " + 
					"from cmm0040 a, cmm0020 b, cmm0020 c " +
					"where a.cm_position = b.cm_micode " +
					"and b.cm_macode = 'POSITION' " +
					"and a.cm_duty = c.cm_micode " +
					"and c.cm_macode = 'DUTY' ";
			ConnectionContext connectionContext = new ConnectionResource();

	    	rsval.clear();
			conn = connectionContext.getConnection();
			pstmt = conn.prepareStatement(Query);
						
			rs = pstmt.executeQuery();
			while(rs.next()){
				rst = new HashMap<String, String>();
				rst.put("cm_username", rs.getString("cm_username"));
				rst.put("cm_userid", rs.getString("cm_userid"));
				rst.put("cm_position", rs.getString("cm_position"));
				rst.put("position", rs.getString("position"));
				rst.put("cm_duty", rs.getString("cm_duty"));
				rst.put("duty", rs.getString("duty"));
				rsval.add(rst);
				rst = null;
			}
	
			returnObjectArray = rsval.toArray();
			rsval.clear();
			rsval = null;
			
			rs.close();
			pstmt.close();
			conn.close();
			conn = null;
			
		}catch (Exception e) {
			e.printStackTrace();
		}finally{
			if (Query != null) 	Query = null;
			if (rs != null)     try{rs.close();}catch (Exception ex){ex.printStackTrace();}
			if (pstmt != null)  try{pstmt.close();}catch (Exception ex2){ex2.printStackTrace();}
			if (conn != null){
				try{
					ConnectionResource.release(conn);
				}catch(Exception ex3){
					ecamsLogger.error("## Kdh_test.getUserList() connection release exception ##");
					ex3.printStackTrace();
				}
			}
		}
		return returnObjectArray;	
	}
	
	public Object[] getUserList(String name, String id, String position, String duty, int closed, String stDt, String edDt)
				throws SQLException,Exception {
		
		Connection			conn		= null;
		PreparedStatement	pstmt		= null;
		ResultSet         	rs          = null;
		String		      	Query    = "";
		ArrayList<HashMap<String, String>>  rsval = new ArrayList<HashMap<String, String>>();
		HashMap<String, String>			  	rst	  = null; 
		Object[] returnObjectArray    = null;
		
		if(position.equals("선택")) position = "";
		if(duty.equals("선택")) duty = "";
		if(stDt.equals(edDt)) stDt = "2000-01-01";
		ConnectionContext connectionContext = new ConnectionResource();
		
		try{
			Query = "select a.cm_userid, a.cm_username, a.cm_position, b.cm_codename position, a.cm_duty, c.cm_codename duty " + 
			"from cmm0040 a, cmm0020 b, cmm0020 c " +
			"where a.cm_position = b.cm_micode " +
			"and b.cm_macode = 'POSITION' " +
			"and a.cm_duty = c.cm_micode " +
			"and c.cm_macode = 'DUTY' " +
			"and a.cm_username like ?" +
			"and a.cm_userid like ?" +
			"and b.cm_codename like ?" +
			"and c.cm_codename like ?" +
			"and a.cm_creatdt between to_date(?, 'YYYY-MM-DD')" +
			"and to_date(?, 'YYYY-MM-DD')";
			
			if(closed == 1) {
				Query += "and a.cm_active = '1'";
			}else if(closed == 2) {
				Query += "and a.cm_active = '0'";				
			}

			rsval.clear();
			conn = connectionContext.getConnection();
			
	        //pstmt = new LoggableStatement(conn, Query.toString());
			pstmt = conn.prepareStatement(Query);
			pstmt.setString(1, "%"+name+"%");
			pstmt.setString(2, "%"+id+"%");
			pstmt.setString(3, "%"+position+"%");
			pstmt.setString(4, "%"+duty+"%");
			pstmt.setString(5, stDt);
			pstmt.setString(6, edDt);
			
	        //ecamsLogger.error(((LoggableStatement)pstmt).getQueryString());
			rs = pstmt.executeQuery();

			while(rs.next()){
				rst = new HashMap<String, String>();
				rst.put("cm_username", rs.getString("cm_username"));
				rst.put("cm_userid", rs.getString("cm_userid"));
				rst.put("cm_position", rs.getString("cm_position"));
				rst.put("position", rs.getString("position"));
				rst.put("cm_duty", rs.getString("cm_duty"));
				rst.put("duty", rs.getString("duty"));
				rsval.add(rst);
				rst = null;
			}
			
			returnObjectArray = rsval.toArray();
			rsval.clear();
			rsval = null;
			
			rs.close();
			pstmt.close();
			conn.close();
			conn = null;
			
		} catch (SQLException sqlexception) {
			sqlexception.printStackTrace();
			throw sqlexception;
		} catch (Exception exception) {
			exception.printStackTrace();
			throw exception;
		}finally{
			if (Query != null) 	Query = null;
			if (rs != null)     try{rs.close();}catch (Exception ex){ex.printStackTrace();}
			if (pstmt != null)  try{pstmt.close();}catch (Exception ex2){ex2.printStackTrace();}
			if (conn != null){
				try{
					ConnectionResource.release(conn);
				}catch(Exception ex3){
					ex3.printStackTrace();
				}
			}
		}
		return returnObjectArray;	
	}
	
	public Object[] getUserListDuty(String duty) throws SQLException,Exception {
		
		Connection			conn		= null;
		PreparedStatement	pstmt		= null;
		ResultSet         	rs          = null;
		String		      	Query    = "";
		ArrayList<HashMap<String, String>>  rsval = new ArrayList<HashMap<String, String>>();
		HashMap<String, String>			  	rst	  = null; 
		Object[] returnObjectArray    = null;
		
		try{
			Query = "select a.cm_userid, a.cm_username, a.cm_position, b.cm_codename position, a.cm_duty, c.cm_codename duty " + 
			"from cmm0040 a, cmm0020 b, cmm0020 c " +
			"where a.cm_position = b.cm_micode " +
			"and b.cm_macode = 'POSITION' " +
			"and a.cm_duty = c.cm_micode " +
			"and c.cm_macode = 'DUTY' " +
			"and c.cm_codename = '" + duty + "'";
			
			ConnectionContext connectionContext = new ConnectionResource();
			
			rsval.clear();
			conn = connectionContext.getConnection();
			
			pstmt = conn.prepareStatement(Query);
			
			rs = pstmt.executeQuery();
			
			while(rs.next()){
				rst = new HashMap<String, String>();
				rst.put("cm_username", rs.getString("cm_username"));
				rst.put("cm_userid", rs.getString("cm_userid"));
				rst.put("cm_position", rs.getString("cm_position"));
				rst.put("position", rs.getString("position"));
				rst.put("cm_duty", rs.getString("cm_duty"));
				rst.put("duty", rs.getString("duty"));
				rsval.add(rst);
				rst = null;
			}
			
			returnObjectArray = rsval.toArray();
			rsval.clear();
			rsval = null;
			
			rs.close();
			pstmt.close();
			conn.close();
			conn = null;
			
		}catch (Exception e) {
			e.printStackTrace();
		}finally{
			if (Query != null) 	Query = null;
			if (rs != null)     try{rs.close();}catch (Exception ex){ex.printStackTrace();}
			if (pstmt != null)  try{pstmt.close();}catch (Exception ex2){ex2.printStackTrace();}
			if (conn != null){
				try{
					ConnectionResource.release(conn);
				}catch(Exception ex3){
					ecamsLogger.error("## Kdh_test.getUserList() connection release exception ##");
					ex3.printStackTrace();
				}
			}
		}
		return returnObjectArray;	
	}
	
	public Object[] getPositionList() throws SQLException,Exception {
		
    	Connection			conn		= null;
    	PreparedStatement	pstmt		= null;
		ResultSet         	rs          = null;
		String		      	Query    = "";
		ArrayList<String>  rsval = new ArrayList<String>();
	
		try {
			
			Query = "select cm_macode, cm_codename from cmm0020 where cm_macode = 'POSITION'";
			ConnectionContext connectionContext = new ConnectionResource();
		
			rsval.clear();
			conn = connectionContext.getConnection();
			pstmt = conn.prepareStatement(Query);
			
			rs = pstmt.executeQuery();
			
			rsval.add("선택");
			while(rs.next()){				
				rsval.add(rs.getString("cm_codename"));
			}
			
			rs.close();
			pstmt.close();
			conn.close();
			conn = null;
			
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			if (Query != null) 	Query = null;
			if (rs != null)     try{rs.close();}catch (Exception ex){ex.printStackTrace();}
			if (pstmt != null)  try{pstmt.close();}catch (Exception ex2){ex2.printStackTrace();}
			if (conn != null){
				try{
					ConnectionResource.release(conn);
				}catch(Exception ex3){
					ecamsLogger.error("## Kdh_test.getUserList() connection release exception ##");
					ex3.printStackTrace();
				}
			}
		}
		
		return rsval.toArray();
	}
	
	public Object[] getDutyList() throws SQLException,Exception {
		
    	Connection			conn		= null;
    	PreparedStatement	pstmt		= null;
		ResultSet         	rs          = null;
		String		      	Query    = "";
		ArrayList<String>  rsval = new ArrayList<String>();
	
		try {
			
			Query = "select cm_macode, cm_codename from cmm0020 where cm_macode = 'DUTY'";
			ConnectionContext connectionContext = new ConnectionResource();
		
			rsval.clear();
			conn = connectionContext.getConnection();
			pstmt = conn.prepareStatement(Query);
			
			rs = pstmt.executeQuery();
			
			rsval.add("선택");
			while(rs.next()){				
				rsval.add(rs.getString("cm_codename"));
			}
			
			rs.close();
			pstmt.close();
			conn.close();
			conn = null;
			
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			if (Query != null) 	Query = null;
			if (rs != null)     try{rs.close();}catch (Exception ex){ex.printStackTrace();}
			if (pstmt != null)  try{pstmt.close();}catch (Exception ex2){ex2.printStackTrace();}
			if (conn != null){
				try{
					ConnectionResource.release(conn);
				}catch(Exception ex3){
					ecamsLogger.error("## Kdh_test.getUserList() connection release exception ##");
					ex3.printStackTrace();
				}
			}
		}
		
		return rsval.toArray();
	}
	
	public String testMethod() {
		
		return "testSuccess";
		
	}
	
	public Object getUserInfo(String id) {
				
    	Connection			conn		= null;
    	PreparedStatement	pstmt		= null;
		ResultSet         	rs          = null;
		String		      	Query    = "";
//		ArrayList<String>  rsval = new ArrayList<String>();
		HashMap<String, String>  rsval = new HashMap<>();
	
		try {
			
			Query = "select * from cmm0040 where cm_userid = '" + id + "'";
			ConnectionContext connectionContext = new ConnectionResource();
		
			rsval.clear();
			conn = connectionContext.getConnection();
			pstmt = conn.prepareStatement(Query);
			
			rs = pstmt.executeQuery();
			
			if(rs.next()){				
				rsval.put("name", rs.getString("cm_username"));
				rsval.put("tel", rs.getString("cm_telno2"));
				rsval.put("email", rs.getString("cm_email"));
				rsval.put("creatDt", rs.getString("cm_creatdt"));
				rsval.put("lastLogin", rs.getString("cm_logindt"));
				rsval.put("ip", rs.getString("cm_ipaddress"));
			}
			
			rs.close();
			pstmt.close();
			conn.close();
			conn = null;
			
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			if (Query != null) 	Query = null;
			if (rs != null)     try{rs.close();}catch (Exception ex){ex.printStackTrace();}
			if (pstmt != null)  try{pstmt.close();}catch (Exception ex2){ex2.printStackTrace();}
			if (conn != null){
				try{
					ConnectionResource.release(conn);
				}catch(Exception ex3){
					ecamsLogger.error("## Kdh_test.getUserList() connection release exception ##");
					ex3.printStackTrace();
				}
			}
		}		
		return rsval;
	}
}
