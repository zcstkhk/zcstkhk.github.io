


  ************************************************************
  *                                                          *
  *                         RecurDyn                         *
  *                                                          *
  *             Recursive Dynamics Analysis Program          *
  *                                                          *
  ************************************************************
  *                                                          *
  *                Solver Version : SDK 5.02.1               *
  *                                                          *
  *                Build Date : Apr 25 2011                  *
  *                Build Time :    16:33:29                  *
  *                                                          *
  *                Copyright (C) 1997 - 2010                 *
  *                                                          *
  *                    Function Bay, Inc.                    *
  *                                                          *
  ************************************************************


 << RECURDYN/CONVERTER PROCESSING >>

 >> READING THE RMD FILE 
  >>> NO. PART = 4
  >>> NO. DUMMY PART = 0
  >>> NO. JOINT = 2

 >> SPANNING TREE 
  >>> NO. JOINT BEFORE SPANNING = 2
  >>> NO. VIRTUALJOINT BEFORE SPANNING = 0
  >>> NO. CUTJOINT BEFORE SPANNING = 0
  >>> CHECK FLOATING BASE PART
  >>> NO. JOINT AFTER SPANNING = 2
  >>> NO. VIRTUALJOINT AFTER SPANNING = 1
  >>> NO. CUTJOINT AFTER SPANNING = 0

 >> CHECKING CUTJOINT 
 ======================================================================== 
               CONVERT-PROCESSING IS SUCCESSFULLY FINISHED
 ======================================================================== 

 << RECURDYN/SOLVER PROCESSING >>

 
 ============================================================
 >> BUILDING THE RD/SOLVER STRUCTURE
 ============================================================
 ============================================================
 >> THE SIZE OF USED INBODY ARRAY =           4
 ------------------------------------------------------------
 >> THE SIZE OF USED JOINT ARRAY =          30
 ------------------------------------------------------------
 >> THE SIZE OF USED JOINTIV ARRAY                 =                0
 ------------------------------------------------------------
 >> THE SIZE OF USED EXTPARIV ARRAY                =                0
 ------------------------------------------------------------
 >> THE SIZE OF USED CUTJOINT ARRAY =           3
 ------------------------------------------------------------
 >> THE SIZE OF USED FLEXBODY ARRAY =           0
 ============================================================
 ========================================================================
 >> THE SIZE OF USED N120 ARRAY                    =             3600
 ------------------------------------------------------------------------
 >> THE SIZE OF USED IPN16_1 ARRAY                 =              200
 ------------------------------------------------------------------------
 >> THE SIZE OF USED IPN17 ARRAY                   =              100
 ------------------------------------------------------------------------
 >> THE SIZE OF USED IPN18 ARRAY                   =              200
 ========================================================================
 ========================================================================
 >> THE SIZE OF USED N90 ARRAY                     =             1990
 ------------------------------------------------------------------------
 >> THE SIZE OF USED N90n1 ARRAY                   =             1648
 ------------------------------------------------------------------------
 >> THE SIZE OF USED N90n2 ARRAY                   =             1000
 ------------------------------------------------------------------------
 >> THE SIZE OF USED N90n3 ARRAY                   =             1000
 ========================================================================
 ============================================================
 >> THE SIZE OF USED RBUS ARRAY =       21104
 ------------------------------------------------------------
 >> THE SIZE OF USED IBUS ARRAY =        1795
 ------------------------------------------------------------
 >> THE SIZE OF USED LBUS ARRAY =         776
 ------------------------------------------------------------
 >> THE SIZE OF USED MGRBUS ARRAY =         148
 ------------------------------------------------------------
 >> THE SIZE OF USED OBUS ARRAY                    =              226
 ========================================================================
 >>> SUCCESSFULLY BUILT THE RD/SOLVER STRUCTURE


                         JOINT INFORMATION 
      =======================================================
        JOINT ID  ACTION MARKER    BASE MARKER     TYPE
      =======================================================
           15          24              25      TRANSLATIONAL
           28          37              38      TRANSLATIONAL
    100000002           3               2        FLOATING   
      =======================================================
 
                       CONSTRAINT INFORMATION
      =======================================================
      CONSTRAINT ID   ACTION MARKER   BASE MARKER    TYPE
      =======================================================
           57              66             67      POINT TO CURVE 
      =======================================================
 
      CONSTRAINT ID    JOINT1    JOINT2    JOINT3    TYPE
      =======================================================
      1000000           15                          MOTION
      =======================================================
 
 
 ======================================================================
 *** WHAT = 
 sim/pos,end=0.000000,step=1                                                    
  
 ======================================================================
 *** TOKEN SIMULATION TYPE = pos
 *** TOKEN ENDTIME =  0.000000000000000E+000   1.00000000000000     
 *** TOKEN PLOT STEPSIZE =           1          30
 
 ============================================================
 >> POSITION ANALYSIS
 ============================================================


                   INITIAL POSITION CONSTRAINT VIOLATION
 ========================================================================
        ID JOINT               ELEMENT                    VIOLATION
 ========================================================================
        15 TRANSLATIONAL       ROTATION ABOUT Y          -4.937195E-12
                               ROTATION ABOUT X          -1.326137E-26
                               TRANSLATION ALONG X        0.000000E+00
                               TRANSLATION ALONG Y        0.000000E+00
                               ROTATION ABOUT Z          -5.551119E-17
 ========================================================================
        28 TRANSLATIONAL       ROTATION ABOUT Y           3.937175E-12
                               ROTATION ABOUT X          -8.390017E-20
                               TRANSLATION ALONG X        0.000000E+00
                               TRANSLATION ALONG Y        0.000000E+00
                               ROTATION ABOUT Z           9.982729E-22
 ========================================================================
        57 POINT TO CURV       TRANSLATION ALONG X        2.937127E-08
 ========================================================================
                               TRANSLATION ALONG Y       -8.889187E-18
 ========================================================================
                               TRANSLATION ALONG Z       -2.231598E-08
 ========================================================================
   1000000        MOTION                                  0.000000E+00
 ========================================================================
 


                       POSITION CONSTRAINT VIOLATION
 ========================================================================
        ID JOINT               ELEMENT                    VIOLATION
 ========================================================================
        15 TRANSLATIONAL       ROTATION ABOUT Y          -4.937195E-12
                               ROTATION ABOUT X          -1.326137E-26
                               TRANSLATION ALONG X        0.000000E+00
                               TRANSLATION ALONG Y        0.000000E+00
                               ROTATION ABOUT Z          -5.551119E-17
 ========================================================================
        28 TRANSLATIONAL       ROTATION ABOUT Y           3.937175E-12
                               ROTATION ABOUT X          -8.390017E-20
                               TRANSLATION ALONG X        0.000000E+00
                               TRANSLATION ALONG Y        0.000000E+00
                               ROTATION ABOUT Z           9.982729E-22
 ========================================================================
        57 POINT TO CURV       TRANSLATION ALONG X        2.699088E-16
 ========================================================================
                               TRANSLATION ALONG Y       -1.537186E-23
 ========================================================================
                               TRANSLATION ALONG Z       -7.769133E-17
 ========================================================================
   1000000        MOTION                                  0.000000E+00
 ========================================================================
 
 >>> POSITION-ANALYSIS IS SUCCESSFULLY FINISHED
 ======================================================================== 
 >>> System Variables After Position Analysis
 ======================================================================== 
 SEQ TYPE                     NAME         DOF                    
 ------------------------------------------------------------------------ 
   1 TRANSLATIONAL JOINT             15    TRANSLATION ALONG Z            
   2 TRANSLATIONAL JOINT             28    TRANSLATION ALONG Z            
   3 FLOATING JOINT           100000002    TRANSLATION ALONG X            
   4 FLOATING JOINT           100000002    TRANSLATION ALONG Y            
   5 FLOATING JOINT           100000002    TRANSLATION ALONG Z            
   6 FLOATING JOINT           100000002    ROTATION ABOUT X               
   7 FLOATING JOINT           100000002    ROTATION ABOUT Y               
   8 FLOATING JOINT           100000002    ROTATION ABOUT Z               
   9 PTCV CONSTRAINT                 57    TRANSLATION ALONG X            
  10 PTCV CONSTRAINT                 57    TRANSLATION ALONG Y            
  11 PTCV CONSTRAINT                 57    TRANSLATION ALONG Z            
  12 MOTION CONSTRAINT          1000000    JOINT /        15              
  13 PTCV EXTRA PARAMETER            57    CURVE /        71              
 ============================================================
  >> SUCCESSFULLY FINISHED POSITION ANALYSIS 
 ============================================================
 
 ============================================================
 >> MAKING THE OUTPUT FILES
 ============================================================
 
 ========================================================================
 >> MAKING THE OUTPUT FILES
 ========================================================================
 >>> SUCCESSFULLY MADE THE OUTPUT FILES
 
 ============================================================
 >> RD/SOLVER-PROCESSING IS SUCCESSFULLY FINISHED
 ============================================================
                                                                          
 ======================================================================== 
