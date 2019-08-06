<%@page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@page import="com.oreilly.servlet.MultipartRequest"%>
<%@page import="com.oreilly.servlet.multipart.Part" %>
<%@page import="com.oreilly.servlet.multipart.MultipartParser" %>
<%@page import="com.oreilly.servlet.multipart.FilePart" %>
<%@page import="com.oreilly.servlet.multipart.ParamPart" %>
<%@page import="java.util.*" %>
<%@page import="java.io.*" %>

<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">

<%

String fileName= "";
String filePath= "";
String saveName= "";
int fileIndex = 1;
request.setCharacterEncoding("UTF-8");

MultipartParser mp = new MultipartParser(request,5120*1024*1024); // 50MB
mp.setEncoding("UTF-8");

Part part;
	try{
	while ((part = mp.readNextPart()) != null) {
			//String name = new String(part.getName().getBytes("UTF-8"),"euc-kr");
			String name = part.getName();
			//name = new String(name.getBytes("8859_1"),"UTF-8");
			
			if (part.isParam()){
				ParamPart paramPart = (ParamPart) part;
				if(name.equals("fullpath")){
					//filePath = new String(paramPart.getStringValue().getBytes("UTF-8"),"euc-kr");
					filePath = paramPart.getStringValue();
					//filePath = new String(filePath.getBytes("8859_1"),"UTF-8");
					
					
					File fpath = new File(filePath);

					if(!fpath.exists()){
						fpath.mkdirs();
					}


				}

				if(name.equals("fullName")){
					//filePath = new String(paramPart.getStringValue().getBytes("UTF-8"),"euc-kr");
					fileName = paramPart.getStringValue();
					//fileName = new String(fileName.getBytes("8859_1"),"UTF-8");
				}

				if(name.equals("saveName")){
					//filePath = new String(paramPart.getStringValue().getBytes("UTF-8"),"euc-kr");
					saveName = paramPart.getStringValue();
					//fileName = new String(fileName.getBytes("8859_1"),"UTF-8");
				}

				//new String(filePart.getFilePath().getBytes("8859-1"),"euc-kr")
				System.out.println("filePath=[" + filePath + "]");
				System.out.println("fileName=[" + fileName + "]");
				System.out.println("saveName=[ " + saveName + " ]");
			}
			if(part.isFile()){
				
				FilePart filePart = (FilePart) part;
				fileName = filePart.getFileName();
				//fileName = new String(filePart.getFileName().getBytes("8859_1"),"UTF-8");

				if (fileName == null){
					fileName = filePart.getFileName();
				}

				if (fileName.equals("")){
					fileName = filePart.getFileName();
				}

				if (filePath == null){
					filePath = "/SW2/nice/bin/tmp";
					//filePath = "/home/ecams/bin/tmp";
					//filePath = "c:\\eCAMS\\webTmp\\";
				}

				if (filePath.equals("")){
					filePath = "/SW2/nice/bin/tmp";
					//filePath = "/home/ecams/bin/tmp";
					//filePath = "c:\\eCAMS\\webTmp\\";
				}

				if ( fileName != null ){
					System.out.println("여기 filePath : " + filePath);
					File newfile=new File(filePath); //디렉토리생성

					if(saveName != null && !"".equals(saveName)){ //파일명이 있을경우 파일을 생성해준다
						newfile=new File(filePath,saveName);
					}
					
					long size=filePart.writeTo(newfile);
				}
				System.out.println("fileName=["+fileName +"]" + " dirpath=[" +filePath+ "]" );
			}
			
		}
	}
	catch(Exception E){
		out.clear();
		out.print("upErr");
		E.printStackTrace();
		throw E;
	}
	finally{
		out.clear();
		out.print(filePath+"\\"+fileName);
	}


%>
