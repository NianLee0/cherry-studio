import { DeleteOutlined } from '@ant-design/icons'
import DragableList from '@renderer/components/DragableList'
import { usePaintings } from '@renderer/hooks/usePaintings'
import FileManager from '@renderer/services/FileManager'
import { Painting } from '@renderer/types'
import { classNames } from '@renderer/utils'
import { Popconfirm } from 'antd'
import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

interface PaintingsListProps {
  paintings: Painting[]
  selectedPainting: Painting
  onSelectPainting: (painting: Painting) => void
  onDeletePainting: (painting: Painting) => void
}

const PaintingsList: FC<PaintingsListProps> = ({ paintings, selectedPainting, onSelectPainting, onDeletePainting }) => {
  const { t } = useTranslation()
  const [dragging, setDragging] = useState(false)
  const { updatePaintings } = usePaintings()

  return (
    <Container style={{ paddingBottom: dragging ? 30 : 0 }}>
      <DragableList
        list={paintings}
        onUpdate={updatePaintings}
        onDragStart={() => setDragging(true)}
        onDragEnd={() => setDragging(false)}>
        {(item: Painting) => (
          <CanvasWrapper key={item.id}>
            <Canvas
              className={classNames(selectedPainting.id === item.id && 'selected')}
              onClick={() => onSelectPainting(item)}>
              {item.files[0] && <ThumbnailImage src={FileManager.getFileUrl(item.files[0])} alt="" />}
            </Canvas>
            <DeleteButton>
              <Popconfirm
                title={t('images.button.delete.image.confirm')}
                onConfirm={() => onDeletePainting(item)}
                okButtonProps={{ danger: true }}
                placement="left">
                <DeleteOutlined />
              </Popconfirm>
            </DeleteButton>
          </CanvasWrapper>
        )}
      </DragableList>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  height: 100%;
  gap: 10px;
  padding: 10px 0;
  background-color: var(--color-background);
  max-width: 100px;
  border-left: 0.5px solid var(--color-border);
`

const CanvasWrapper = styled.div`
  position: relative;

  &:hover {
    .delete-button {
      opacity: 1;
    }
  }
`

const Canvas = styled.div`
  width: 80px;
  height: 80px;
  background-color: var(--color-background-soft);
  cursor: pointer;
  transition: background-color 0.2s ease;
  border: 1px solid var(--color-background-soft);
  overflow: hidden;
  position: relative;

  &.selected {
    border: 1px solid var(--color-primary);
  }

  &:hover {
    background-color: var(--color-background-mute);
  }
`

const ThumbnailImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`

const DeleteButton = styled.div.attrs({ className: 'delete-button' })`
  position: absolute;
  top: 4px;
  right: 4px;
  opacity: 0;
  transition: opacity 0.2s ease;
  border-radius: 50%;
  padding: 4px;
  cursor: pointer;
  color: var(--color-error);
  background-color: var(--color-background-soft);
  display: flex;
  align-items: center;
  justify-content: center;
`

export default PaintingsList
