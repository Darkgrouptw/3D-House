# 3D-House XML結構說明：

### 之前的版本：

``` xml 
<layer>
    <element>
        <type>Base/Basic.js</type>
        <transform>1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1</transform>
        <texture>Ground.jpg</texture>
        <pos>base</pos>
        <property>
            <height>8</height>
            <width>18</width>
            <thickness>0.5</thickness>
        </property>
    </element>
</layer>
```

### 「建議」版本：

* ```<pos>``` 標籤似乎只是用來當作識別用，所以我把它加在 ```<element>``` 標籤中的屬性
* ```<texture>``` 標籤擴展成有可以純顏色的 ```<color>``` 與指定檔案的 ```<file>```
* ```<transform>``` 標籤細分成為： 旋轉 ```<rotate>```，平移 ```<translate>``` ，縮放 ```<scale>```
* ```<type>``` 標籤中的類型都改成小寫的版本
* ```<decorate>``` 標籤可以用來修飾該 ```<element>```，裡面放的也是 ```<element>```

``` xml 
<layer>
    <element id="bottom_base">
        <type>base/basic.js</type>
        
        <transform>
            <scale>1,1,1</scale>
            <rotate>0,0,0</rotate>
            <translate>0,0,0</translate>
        </transform>
        
        <texture>
            <file>Ground.jpg</file>
            <color>255,255,0</color>
        </texture>
        
        <property>
            <height>8</height>
            <width>18</width>
            <thickness>0.5</thickness>
        </property>
        
        <decorate>
            <element> ... </element>
        </decorate>
    </element>
</layer>
```

這一個建議的版本或許在實做上有一些不必要的定義，所以可以按實際需要來修改。
但是在部份定義上，建議保留標籤的屬性部份，因為有些例子可能需要用到。

多個窗戶定義例子，請參閱 XML/wall/wall-multi_window.xml

* ```<wsize>``` 標籤中的 ```mode``` 的屬性是給予可以選擇不同大小 ```diff``` 、相同大小 ```same``` 、自動產生 ```auto```
* ```<wcntr>``` 標籤中的 ```mode``` 的屬性為 ```auto``` 的話代表參考 ```<arrange>``` 來產生相對應的排列， 手動 ```manual``` 的話就必須逐一給定
* ```<arrange>``` 是當 ```<wcntr>``` 為 ```auto``` 時，才具有效果

``` xml
<layer>
    <element id="mwindow">
        <type>wall/multi_window</type>
        <transform>
            <scale>1,1,1</scale>
            <rotate>0,0,0</rotate>
            <translate>0,0,0</translate>
        </transform>
        <property>
            <width>10</width>
            <height>10</height>
            <thickness>1</thickness>
            <center>0,0,0</center>
  
            <!--When wsize="same" or "auto", ignore below part -->
            <!--When wsize change to same, it will choose the list minimum value in-->
            <!-- wsize mode="diff">1,1,2,2,3,3,4,4</wsize -->
            <wsize mode="same">2,2</wsize>
            <!-- wsize mode="auto"></wsize -->
            
            <!-- For window center -->
            <!-- wcntr mode="manual">0.3,0.3,0.5,0.5,0.7,0.7,0.9,0.9</wcntr -->
            <wcntr mode="auto"></wcntr>
            
            <!--When wcntr="manual", ignore below part-->
            <!--value is column, size is row-->
            <arrange major="row">3, 2</arrange>
			
        </property>
    </element>
</layer>
```

