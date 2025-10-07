# Common Components Usage

- AppButton:
```
<AppButton label="저장" variant="primary" onPress={() => {}} />
```

- AppHeader:
```
<AppHeader title="설정" onBack={() => {}} />
```

- BottomTabBar:
```
<BottomTabBar tabs={["홈","설정"]} activeTab="홈" onChangeTab={() => {}} />
```

- InfoCard:
```
<InfoCard title="온도" value={24} unit="°C" />
```

- AlertBanner:
```
<AlertBanner type="info" message="알림 메시지" />
```

- ModalPopup:
```
<ModalPopup visible title="확인" description="저장할까요?" onCancel={()=>{}} onConfirm={()=>{}} />
```

- SwitchRow:
```
<SwitchRow label="알림" value onToggle={()=>{}} />
```

- InputField:
```
<InputField value="" onChangeText={()=>{}} placeholder="입력" />
```

- ToastMessage:
```
<ToastMessage type="success" message="완료" />
```

- IconButton:
```
<IconButton icon={<Text>☆</Text>} onPress={()=>{}} />
```

- Divider:
```
<Divider />
```
