import { ComponentBase, gh, getProps, isExecute, vueDefineComponent, DefineVueComponent } from '@syncfusion/ej2-vue-base';
import { isNullOrUndefined, getValue } from '@syncfusion/ej2-base';
import { isUndefined } from '@syncfusion/ej2-base';

import { Schedule, ScheduleModel } from '@syncfusion/ej2-schedule';
import { ViewsDirective, ViewDirective, ViewsPlugin, ViewPlugin } from './views.directive'
import { ResourcesDirective, ResourceDirective, ResourcesPlugin, ResourcePlugin } from './resources.directive'
import { HeaderRowsDirective, HeaderRowDirective, HeaderRowsPlugin, HeaderRowPlugin } from './headerrows.directive'


export const properties: string[] = ['isLazyUpdate', 'plugins', 'agendaDaysCount', 'allowDragAndDrop', 'allowInline', 'allowKeyboardInteraction', 'allowMultiCellSelection', 'allowMultiDrag', 'allowMultiRowSelection', 'allowResizing', 'allowSwiping', 'calendarMode', 'cellHeaderTemplate', 'cellTemplate', 'cssClass', 'currentView', 'dateFormat', 'dateHeaderTemplate', 'dateRangeTemplate', 'dayHeaderTemplate', 'editorFooterTemplate', 'editorHeaderTemplate', 'editorTemplate', 'enableAdaptiveUI', 'enableAllDayScroll', 'enableHtmlSanitizer', 'enablePersistence', 'enableRecurrenceValidation', 'enableRtl', 'endHour', 'eventDragArea', 'eventSettings', 'firstDayOfWeek', 'firstMonthOfYear', 'group', 'headerIndentTemplate', 'headerRows', 'height', 'hideEmptyAgendaDays', 'locale', 'maxDate', 'minDate', 'monthHeaderTemplate', 'monthsCount', 'quickInfoOnSelectionEnd', 'quickInfoTemplates', 'readonly', 'resourceHeaderTemplate', 'resources', 'rowAutoHeight', 'selectedDate', 'showHeaderBar', 'showQuickInfo', 'showTimeIndicator', 'showWeekNumber', 'showWeekend', 'startHour', 'timeFormat', 'timeScale', 'timezone', 'timezoneDataSource', 'views', 'weekRule', 'width', 'workDays', 'workHours', 'actionBegin', 'actionComplete', 'actionFailure', 'cellClick', 'cellDoubleClick', 'created', 'dataBinding', 'dataBound', 'destroyed', 'drag', 'dragStart', 'dragStop', 'eventClick', 'eventDoubleClick', 'eventRendered', 'hover', 'moreEventsClick', 'navigating', 'popupClose', 'popupOpen', 'renderCell', 'resizeStart', 'resizeStop', 'resizing', 'select', 'virtualScrollStart', 'virtualScrollStop'];
export const modelProps: string[] = ['currentView', 'selectedDate'];

export const testProp: any = getProps({props: properties});
export const props = testProp[0], watch = testProp[1], emitProbs: any = Object.keys(watch);
emitProbs.push('modelchanged', 'update:modelValue');
for (let props of modelProps) { emitProbs.push('update:'+props) }

/**
 * `ej-schedule` represents the VueJS Schedule Component.
 * ```vue
 * <ejs-schedule></ejs-schedule>
 * ```
 */
export let ScheduleComponent: DefineVueComponent<ScheduleModel> =  vueDefineComponent({
    name: 'ScheduleComponent',
    mixins: [ComponentBase],
    props: props,
    watch: watch,
    emits: emitProbs,
    model: { event: 'modelchanged' },
    provide() { return { custom: this.custom } },
    data() {
        return {
            ej2Instance: new Schedule({}) as any,
            propKeys: properties as string[],
            models: modelProps as string[],
            hasChildDirective: true as boolean,
            hasInjectedModules: true as boolean,
            tagMapper: {"e-views":"e-view","e-resources":"e-resource","e-header-rows":"e-header-row"} as { [key: string]: Object },
            tagNameMapper: {"e-header-rows":"e-headerRows"} as Object,
            isVue3: !isExecute as boolean,
            templateCollection: {} as any,
        }
    },
    created() {
        this.ej2Instances._trigger = this.ej2Instances.trigger;
        this.ej2Instances.trigger = this.trigger;
        this.bindProperties();
        this.ej2Instances._setProperties = this.ej2Instances.setProperties;
        this.ej2Instances.setProperties = this.setProperties;
        this.ej2Instances.clearTemplate = this.clearTemplate;
        this.updated = this.updated;
    },
    render(createElement: any) {
        let h: any = !isExecute ? gh : createElement;
        let slots: any = null;
        if(!isNullOrUndefined((this as any).$slots.default)) {
            slots = !isExecute ? (this as any).$slots.default() : (this as any).$slots.default;
        }
        return h('div', slots);
    },
    methods: {
        clearTemplate(templateNames?: string[]): any {
            if (!templateNames){ templateNames = Object.keys(this.templateCollection || {}) }
            if (templateNames.length &&  this.templateCollection) {
                for (let tempName of templateNames){
                    let elementCollection: any = this.templateCollection[tempName];
                    if(elementCollection && elementCollection.length) {
                        for(let ele of elementCollection) {
                            let destroy: any = getValue('__vue__.$destroy', ele);
                            if (destroy) { ele.__vue__.$destroy() }
                            if (ele.innerHTML) { ele.innerHTML = '' }
                        }
                        delete this.templateCollection[tempName];
                    }
                }
            }
        },
        setProperties(prop: any, muteOnChange: boolean): void {
            if(this.isVue3) { this.models = !this.models ? this.ej2Instances.referModels : this.models }
            if (this.ej2Instances && this.ej2Instances._setProperties) {
                this.ej2Instances._setProperties(prop, muteOnChange);
            }
            if (prop && this.models && this.models.length) {
                Object.keys(prop).map((key: string): void => {
                    this.models.map((model: string): void => {
                        if ((key === model) && !(/datasource/i.test(key))) {
                            if (this.isVue3) {
                                this.ej2Instances.vueInstance.$emit('update:' + key, prop[key]);
                            } else {
                                (this as any).$emit('update:' + key, prop[key]);
                                (this as any).$emit('modelchanged', prop[key]);
                            }
                        }
                    });
                });
            }
        },        
        trigger(eventName: string, eventProp: {[key:string]:Object}, successHandler?: Function): void {
            if(!isExecute) { this.models = !this.models ? this.ej2Instances.referModels : this.models }
            if ((eventName === 'change' || eventName === 'input') && this.models && (this.models.length !== 0)) {
                let key: string[] = this.models.toString().match(/checked|value/) || [];
                let propKey: string = key[0];
                if (eventProp && key && !isUndefined(eventProp[propKey])) {
                    if (!isExecute) {
                        this.ej2Instances.vueInstance.$emit('update:' + propKey, eventProp[propKey]);
                        this.ej2Instances.vueInstance.$emit('modelchanged', eventProp[propKey]);
                        this.ej2Instances.vueInstance.$emit('update:modelValue', eventProp[propKey]);
                    } else {
                        if (eventName === 'change' || ((this as any).$props && !(this as any).$props.isLazyUpdate)) {
                            (this as any).$emit('update:'+ propKey, eventProp[propKey]);
                            (this as any).$emit('modelchanged', eventProp[propKey]);
                        }
                    }
                }
            } else if ((eventName === 'actionBegin' && eventProp.requestType === 'dateNavigate') && this.models && (this.models.length !== 0)) {
                let key: string[] = this.models.toString().match(/currentView|selectedDate/) || [];
                let propKey: string = key[0];
                if (eventProp && key && !isUndefined(eventProp[propKey])) {
                    if (!isExecute) {
                        this.ej2Instances.vueInstance.$emit('update:' + propKey, eventProp[propKey]);
                        this.ej2Instances.vueInstance.$emit('modelchanged', eventProp[propKey]);
                    } else {
                        (this as any).$emit('update:'+ propKey, eventProp[propKey]);
                        (this as any).$emit('modelchanged', eventProp[propKey]);
                    }
                }
            }
            if ((this.ej2Instances && this.ej2Instances._trigger)) {
                this.ej2Instances._trigger(eventName, eventProp, successHandler); 
            }
        },

        custom(): void {
            this.updated();
        },
        addEvent(data: Object | Object[]): void {
            return this.ej2Instances.addEvent(data);
        },
        addResource(resources: Object | Object[], name: string, index: number): void {
            return this.ej2Instances.addResource(resources, name, index);
        },
        changeCurrentView(viewName: Object, viewIndex?: number): void {
            return this.ej2Instances.changeCurrentView(viewName, viewIndex);
        },
        closeEditor(): void {
            return this.ej2Instances.closeEditor();
        },
        closeQuickInfoPopup(): void {
            return this.ej2Instances.closeQuickInfoPopup();
        },
        closeTooltip(): void {
            return this.ej2Instances.closeTooltip();
        },
        collapseResource(resourceId: string | number, name: string): void {
            return this.ej2Instances.collapseResource(resourceId, name);
        },
        deleteEvent(id: string | number | Object | Object[], currentAction?: Object): void {
            return this.ej2Instances.deleteEvent(id, currentAction);
        },
        expandResource(resourceId: string | number, name: string): void {
            return this.ej2Instances.expandResource(resourceId, name);
        },
        exportToExcel(excelExportOptions?: Object): void {
            return this.ej2Instances.exportToExcel(excelExportOptions);
        },
        exportToICalendar(fileName?: string, customData?: Object[]): void {
            return this.ej2Instances.exportToICalendar(fileName, customData);
        },
        generateEventOccurrences(event: Object, startDate?: Object): Object[] {
            return this.ej2Instances.generateEventOccurrences(event, startDate);
        },
        getBlockEvents(startDate?: Object, endDate?: Object, includeOccurrences?: boolean): Object[] {
            return this.ej2Instances.getBlockEvents(startDate, endDate, includeOccurrences);
        },
        getCellDetails(tdCol: Object | Object[]): Object {
            return this.ej2Instances.getCellDetails(tdCol);
        },
        getCurrentViewDates(): Object[] {
            return this.ej2Instances.getCurrentViewDates();
        },
        getCurrentViewEvents(): Object[] {
            return this.ej2Instances.getCurrentViewEvents();
        },
        getCurrentViewIndex(): number {
            return this.ej2Instances.getCurrentViewIndex();
        },
        getDeletedOccurrences(recurrenceData: string | number | Object): Object[] {
            return this.ej2Instances.getDeletedOccurrences(recurrenceData);
        },
        getEventDetails(element: Object): Object {
            return this.ej2Instances.getEventDetails(element);
        },
        getEventMaxID(): number | string {
            return this.ej2Instances.getEventMaxID();
        },
        getEvents(startDate?: Object, endDate?: Object, includeOccurrences?: boolean): Object[] {
            return this.ej2Instances.getEvents(startDate, endDate, includeOccurrences);
        },
        getIndexFromResourceId(id: string | number, name?: string): number {
            return this.ej2Instances.getIndexFromResourceId(id, name);
        },
        getOccurrencesByID(eventID: number | string): Object[] {
            return this.ej2Instances.getOccurrencesByID(eventID);
        },
        getOccurrencesByRange(startTime: Object, endTime: Object): Object[] {
            return this.ej2Instances.getOccurrencesByRange(startTime, endTime);
        },
        getResourceCollections(): Object[] {
            return this.ej2Instances.getResourceCollections();
        },
        getResourcesByIndex(index: number): Object {
            return this.ej2Instances.getResourcesByIndex(index);
        },
        getSelectedElements(): Object[] {
            return this.ej2Instances.getSelectedElements();
        },
        hideSpinner(): void {
            return this.ej2Instances.hideSpinner();
        },
        importICalendar(fileContent: Object | string): void {
            return this.ej2Instances.importICalendar(fileContent);
        },
        isSlotAvailable(startTime: Object | Object, endTime?: Object, groupIndex?: number): boolean {
            return this.ej2Instances.isSlotAvailable(startTime, endTime, groupIndex);
        },
        openEditor(data: Object, action: Object, isEventData?: boolean, repeatType?: number): void {
            return this.ej2Instances.openEditor(data, action, isEventData, repeatType);
        },
        openQuickInfoPopup(data: Object): void {
            return this.ej2Instances.openQuickInfoPopup(data);
        },
        print(printOptions?: Object): void {
            return this.ej2Instances.print(printOptions);
        },
        refreshEvents(isRemoteRefresh: boolean): void {
            return this.ej2Instances.refreshEvents(isRemoteRefresh);
        },
        refreshLayout(): void {
            return this.ej2Instances.refreshLayout();
        },
        refreshTemplates(templateName?: string): void {
            return this.ej2Instances.refreshTemplates(templateName);
        },
        removeResource(resourceId: string | string[] | number | number[], name: string): void {
            return this.ej2Instances.removeResource(resourceId, name);
        },
        resetWorkHours(dates: Object[], start?: string, end?: string, groupIndex?: number): void {
            return this.ej2Instances.resetWorkHours(dates, start, end, groupIndex);
        },
        saveEvent(data: Object | Object[], currentAction?: Object): void {
            return this.ej2Instances.saveEvent(data, currentAction);
        },
        scrollTo(hour: string, scrollDate?: Object): void {
            return this.ej2Instances.scrollTo(hour, scrollDate);
        },
        scrollToResource(resourceId: string | number, groupName?: string): void {
            return this.ej2Instances.scrollToResource(resourceId, groupName);
        },
        selectResourceByIndex(groupIndex: number): void {
            return this.ej2Instances.selectResourceByIndex(groupIndex);
        },
        setRecurrenceEditor(recurrenceEditor: Object): void {
            return this.ej2Instances.setRecurrenceEditor(recurrenceEditor);
        },
        setResourceCollections(resourceCol: Object[]): void {
            return this.ej2Instances.setResourceCollections(resourceCol);
        },
        setWorkHours(dates: Object[], start: string, end: string, groupIndex?: number): void {
            return this.ej2Instances.setWorkHours(dates, start, end, groupIndex);
        },
        showSpinner(): void {
            return this.ej2Instances.showSpinner();
        },
    }
});

export type ScheduleComponent = InstanceType<typeof ScheduleComponent>;

export const SchedulePlugin = {
    name: 'ejs-schedule',
    install(Vue: any) {
        Vue.component(SchedulePlugin.name, ScheduleComponent);
        Vue.component(ViewPlugin.name, ViewDirective);
        Vue.component(ViewsPlugin.name, ViewsDirective);
        Vue.component(ResourcePlugin.name, ResourceDirective);
        Vue.component(ResourcesPlugin.name, ResourcesDirective);
        Vue.component(HeaderRowPlugin.name, HeaderRowDirective);
        Vue.component(HeaderRowsPlugin.name, HeaderRowsDirective);

    }
}