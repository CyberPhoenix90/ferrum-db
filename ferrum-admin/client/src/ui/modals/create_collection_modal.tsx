import {
    Button,
    DropDownMenu,
    FloatingWindow,
    NumberField,
    Submit,
    TextField,
    ToggleField,
    WindowContent,
    WindowContentRow,
    WindowFooter,
    WindowTitle,
    createForm,
} from 'aurum-components';
import { ArrayDataSource, Aurum, DataSource, Renderable, dsMap } from 'aurumjs';
import { CollectionKeyType, CollectionValueType, CollectionCompression, CollectionPersistence, CollectionEvictionStrategy, SuccessResponseCode } from 'shared';
import { LoadingSpinner } from '../components/loading_spinner.js';
import { ErrorIndicator } from '../components/error_indicator.js';
import { DbClient } from '../../endpoints/db_client.js';

export interface CollectionModel {
    name: string;
    type: CollectionPersistence;
}

export interface CreateCollectionModalProps {
    dialogs: ArrayDataSource<Renderable>;
    onClose?: (model: CollectionModel) => void;
    serverIP: string;
    serverPort: number;
    dbName: string;
}

export function CreateCollectionModal(this: Renderable, props: CreateCollectionModalProps): Renderable {
    const close = function (this: Renderable, model?: CollectionModel) {
        props.dialogs.remove(this);
        props.onClose?.(model);
    }.bind(this);
    const form = createForm<{
        name: string;
        keyType: CollectionKeyType;
        valueType: CollectionValueType;
        compression: CollectionCompression;
        persistence: CollectionPersistence;
        limitRecordCount: boolean;
        maxRecordCount: number;
        limitCollectionSize: boolean;
        maxCollectionSize: number;
        evictionStrategy: CollectionEvictionStrategy;
        advanced: boolean;
        pageSize: number;
        overProvisionFactor: number;
    }>(
        {
            fields: {
                name: {
                    source: new DataSource(),
                    minLength: 1,
                    maxLength: 80,
                },
                keyType: {
                    source: new DataSource(CollectionKeyType.STRING),
                    oneOf: Object.values(CollectionKeyType),
                },
                valueType: {
                    source: new DataSource(CollectionValueType.JSON),
                    oneOf: Object.values(CollectionValueType),
                },
                compression: {
                    source: new DataSource(CollectionCompression.LZ4),
                    oneOf: Object.values(CollectionCompression),
                },
                persistence: {
                    source: new DataSource(CollectionPersistence.PERSISTENT),
                    oneOf: Object.values(CollectionPersistence),
                },
                limitRecordCount: {
                    source: new DataSource(false),
                },
                maxRecordCount: {
                    source: new DataSource(1000),
                    integer: true,
                    min: 1,
                },
                limitCollectionSize: {
                    source: new DataSource(false),
                },
                maxCollectionSize: {
                    source: new DataSource(1024),
                    integer: true,
                    min: 1,
                },
                evictionStrategy: {
                    source: new DataSource(CollectionEvictionStrategy.LRU),
                    oneOf: Object.values(CollectionEvictionStrategy),
                },
                advanced: {
                    source: new DataSource(false),
                },
                pageSize: {
                    source: new DataSource(16),
                    integer: true,
                    min: 16,
                },
                overProvisionFactor: {
                    source: new DataSource(2),
                    min: 1,
                    max: 10,
                },
            },
        },
        async (model, markAsFailed) => {
            const { code } = await DbClient.createCollection({
                collectionName: model.name,
                compression: model.compression,
                dbName: props.dbName,
                evictionStrategy: model.evictionStrategy,
                keyType: model.keyType,
                maxCollectionSize: model.maxCollectionSize,
                maxRecordCount: model.maxRecordCount,
                overProvisionFactor: model.overProvisionFactor,
                pageSize: model.pageSize,
                persistence: model.persistence,
                serverIP: props.serverIP,
                serverPort: props.serverPort,
                valueType: model.valueType,
            });

            if (code !== SuccessResponseCode.OK) {
                markAsFailed('Failed to create collection.');
            } else {
                close({
                    name: model.name,
                    type: model.persistence,
                });
            }
        },
    );

    return (
        <FloatingWindow onClose={() => close()} onEnter={form.submit} onEscape={() => close()} closable draggable w={500} h={600}>
            <WindowTitle>
                <i class="fas fa-table"></i> Add Collection
            </WindowTitle>
            <WindowContent>
                <WindowContentRow>
                    <label>Collection name</label>
                    <TextField form={form} name="name"></TextField>
                </WindowContentRow>
                <WindowContentRow>
                    <label>Key type</label>
                    <DropDownMenu form={form} name="keyType"></DropDownMenu>
                </WindowContentRow>
                <WindowContentRow>
                    <label>Value type</label>
                    <DropDownMenu form={form} name="valueType"></DropDownMenu>
                </WindowContentRow>
                <WindowContentRow>
                    <label>
                        Compression{' '}
                        <i
                            class="fas fa-info-circle"
                            title="Compression is used to reduce the size of the data stored in the collection.
This has modest performance impact. Should only be disabled for very high frequency read/write collections.
lz4: speed over compression ratio
zstd: compression ratio over speed"></i>
                    </label>
                    <DropDownMenu form={form} name="compression"></DropDownMenu>
                </WindowContentRow>
                <WindowContentRow>
                    <label>
                        Persistence{' '}
                        <i
                            class="fas fa-info-circle"
                            title="Persistent collections are stored on disk and survive server restarts.
Volatile collections are stored in memory and are lost on server restart.
Compression is highly recommended for volatile collections."></i>
                    </label>
                    <DropDownMenu form={form} name="persistence"></DropDownMenu>
                </WindowContentRow>
                <WindowContentRow>
                    <label>
                        Limit record count <i class="fas fa-info-circle" title="Enables auto eviction"></i>
                    </label>
                    <ToggleField form={form} name="limitRecordCount"></ToggleField>
                </WindowContentRow>
                {form.schema.fields.limitRecordCount.source.transform(
                    dsMap((v) =>
                        v ? (
                            <WindowContentRow>
                                <label>Max record count</label>
                                <TextField form={form} name="maxRecordCount"></TextField>
                            </WindowContentRow>
                        ) : undefined,
                    ),
                )}
                <WindowContentRow>
                    <label>
                        Limit collection size <i class="fas fa-info-circle" title="Enables auto eviction"></i>
                    </label>
                    <ToggleField form={form} name="limitCollectionSize"></ToggleField>
                </WindowContentRow>
                {form.schema.fields.limitCollectionSize.source.transform(
                    dsMap((v) =>
                        v ? (
                            <WindowContentRow>
                                <label>Max collection size</label>
                                <TextField form={form} name="maxCollectionSize"></TextField>
                            </WindowContentRow>
                        ) : undefined,
                    ),
                )}
                {DataSource.fromAggregation(
                    [form.schema.fields.limitRecordCount.source, form.schema.fields.limitCollectionSize.source],
                    (limitRecordCount, limitCollectionSize) =>
                        limitRecordCount || limitCollectionSize ? (
                            <WindowContentRow>
                                <label>Eviction strategy</label>
                                <DropDownMenu form={form} name="evictionStrategy"></DropDownMenu>
                            </WindowContentRow>
                        ) : undefined,
                )}
                <WindowContentRow>
                    <label>Advanced</label>
                    <ToggleField form={form} name="advanced"></ToggleField>
                </WindowContentRow>
                {form.schema.fields.advanced.source.transform(
                    dsMap((v) =>
                        v ? (
                            <>
                                <WindowContentRow>
                                    <label>
                                        Page size (MB){' '}
                                        <i
                                            class="fas fa-info-circle"
                                            title="How many MB a page file can have before the next one is written. More page files means less garbage but more fragmentation. It's a performance vs disk space efficiency tradeoff"></i>
                                    </label>
                                    <NumberField form={form} name="pageSize"></NumberField>
                                </WindowContentRow>
                                <WindowContentRow>
                                    <label>
                                        Over provision factor{' '}
                                        <i
                                            class="fas fa-info-circle"
                                            title="How much extra space to allocate for a record in case of flexible data types.
Flexible data types are string, ndjson and binary.
A factor of 2 means that the record will have 2x the space it needs and can be appended to without rewriting the record"></i>
                                    </label>
                                    <NumberField form={form} name="overProvisionFactor"></NumberField>
                                </WindowContentRow>
                            </>
                        ) : undefined,
                    ),
                )}
                <LoadingSpinner loading={form.submitting} message="Creating collection..."></LoadingSpinner>
                <ErrorIndicator error={form.submitError}></ErrorIndicator>
            </WindowContent>
            <WindowFooter>
                <div class="right">
                    <Button
                        buttonType="neutral"
                        onClick={() => close()}
                        style={{
                            minWidth: '120px',
                        }}>
                        Cancel
                    </Button>
                    <Submit
                        form={form}
                        buttonType={'action'}
                        style={{
                            minWidth: '120px',
                        }}>
                        OK
                    </Submit>
                </div>
            </WindowFooter>
        </FloatingWindow>
    );
}
