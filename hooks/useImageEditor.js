import { useState, useCallback } from 'react';

export const useImageEditor = () => {
  const [zoom, setZoomState] = useState(100);
  const [position, setPositionState] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const setZoom = useCallback((level) => {
    setZoomState(Math.min(Math.max(level, 50), 200));
  }, []);

  const resetZoom = useCallback(() => {
    setZoomState(100);
  }, []);

  const setPosition = useCallback((x, y) => {
    setPositionState({ x, y });
  }, []);

  const resetPosition = useCallback(() => {
    setPositionState({ x: 0, y: 0 });
  }, []);

  const centerImage = useCallback(() => {
    setPositionState({ x: 0, y: 0 });
  }, []);

  const getEditedImageData = useCallback(() => {
    return {
      zoom,
      position
    };
  }, [zoom, position]);

  const handleDragStart = useCallback((e) => {
    setIsDragging(true);
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    setDragStart({ 
      x: clientX - position.x, 
      y: clientY - position.y 
    });
  }, [position]);

  const handleDrag = useCallback((e) => {
    if (!isDragging) return;
    e.preventDefault();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    setPositionState({
      x: clientX - dragStart.x,
      y: clientY - dragStart.y
    });
  }, [isDragging, dragStart]);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  return {
    zoom,
    position,
    isDragging,
    setZoom,
    resetZoom,
    setPosition,
    resetPosition,
    centerImage,
    getEditedImageData,
    handleDragStart,
    handleDrag,
    handleDragEnd
  };
};