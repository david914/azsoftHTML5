package com.ecams.service.list;

import java.util.*;

public class UserList{
	
private static Vector userVector = new Vector();      //User_id ����
private static Vector idVector = new Vector();        //Session id ����

//���� ������ User�� Session id�� �����Ѵ�.
public static void addUser(String userName, String id){   
	String temp;
             //���� ���� �Ǿ��ִ��� Ȯ��
	for(int i=0;i<userVector.size();i++){
		temp = (String)userVector.elementAt(i);
		if(userName.equals(temp))
                {      //���� ���ӵǾ������� end
				return;
		}
	}
	userVector.addElement(userName);// User id�� �����Ѵ�.
	idVector.addElement(id);       // Session id�� �����Ѵ�.
}
//User id�� Session id�� ���� ��Ų��.
public static void removeUser(String user){ 
	String temp;
	for(int i=0;i<userVector.size();i++){
		temp = (String)userVector.elementAt(i);
		if(user.equals(temp)){       //User id�� ���� ��
			userVector.removeElementAt(i); //User id ����
			idVector.removeElementAt(i); //Session id ����
			return;
		}
	}
}

//���ӵ��ִ�(Vector)�� ���ӵ��ִ� ��� User id�� return �Ѵ�.
public Vector getUser(){            
	return userVector;
}
	
//User id�� Session id���� ��´�.
public static String getid(String name){          
	String temp;
	for(int i=0;i<userVector.size();i++) //User id�� ���� ��. 
	{
		temp = (String)userVector.elementAt(i);
		if(name.equals(temp))//���� ���� ������ Session id return
		{
			return (String)idVector.get(i);
		}
	}
	return ""; //���� ���� ������ " " return
}
//Session id ���� ��ü�Ѵ�.
public static void setid(String name,String id)   
{
	String temp;
	for(int i=0;i<userVector.size();i++) //User id���� ���Ѵ�.
	{
		temp = (String)userVector.elementAt(i);
		if(name.equals(temp))    //User id ���� ������
		{
			idVector.set(i, id);  //Session ���� ��ü�Ѵ�.
		}
	}
}

public static int logck(String name)  //�α��� ���ִ� ���� check �Ѵ�.
{
	String temp;
	for(int i=0;i<userVector.size();i++) //User id ���� ���Ѵ�.
	{
		temp = (String)userVector.elementAt(i);
		if(name.equals(temp))//User id ���� ������(�α��� ��������) 
		{
			return 3;    // 3�� return
		}
	}
	return 1;      //User id ���� ������ ������(�α��� �ȵ�������)
	}
}
